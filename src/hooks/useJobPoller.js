import { useEffect, useRef } from "react";
import { getJobStatus, getDownloadUrl } from "../api/optimizer";
import { useJob, STAGES } from "../context/JobContext";
import { getFriendlyError } from "../utils/errorMessages";
import { getBlockchainVerificationStatus } from "../api/optimizer";

const POLL_INTERVAL_MS = 2500;

export const useJobPoller = () => {
  const {
    jobId,
    stage,
    setStage,
    setDownloadUrl,
    setErrorMsg,
    reset,
    verificationId,
    setBlockchainResult,
  } = useJob();
  const intervalRef = useRef(null);

  const pollBlockchain = async (verificationId) => {
    const INTERVAL = 10000;
    const TIMEOUT = 360000;
    const start = Date.now();

    const interval = setInterval(async () => {
      try {
        const { data } = await getBlockchainVerificationStatus(verificationId);
        const { status } = data.data;

        if (status === "verified") {
          clearInterval(interval);
          setBlockchainResult({
            txHash: data.data.blockchainTxHash,
            etherscanUrl: data.data.blockchainExplorerUrl,
            verifiedAt: data.data.verifiedAt,
          });
          setStage(STAGES.DONE);
        }

        if (status === "failed" || Date.now() - start >= TIMEOUT) {
          clearInterval(interval);
          setStage(STAGES.DONE); // still let them download, just without verification
        }
      } catch {
        clearInterval(interval);
        setStage(STAGES.DONE);
      }
    }, INTERVAL);
  };

  useEffect(() => {
    if (stage !== STAGES.PROCESSING || !jobId) return;

    intervalRef.current = setInterval(async () => {
      try {
        const { data } = await getJobStatus(jobId);

        if (data.data.status === "DONE") {
          clearInterval(intervalRef.current);
          const { data: dlData } = await getDownloadUrl(jobId);
          setDownloadUrl(dlData.data.downloadUrl);

          if (verificationId) {
            setStage(STAGES.VERIFYING);
            pollBlockchain(verificationId);
          } else {
            setStage(STAGES.DONE);
          }
        }

        if (data.data.status === "FAILED") {
          clearInterval(intervalRef.current);
          setErrorMsg(
            data.data.errorMsg ?? "Processing failed. Please try again.",
          );
          setStage(STAGES.FAILED);
        }
      } catch (err) {
        clearInterval(intervalRef.current);
        setErrorMsg(getFriendlyError(err));
        setStage(STAGES.FAILED);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, [stage, jobId]);
};
