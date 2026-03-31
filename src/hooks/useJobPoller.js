import { useEffect, useRef } from "react";
import CryptoJS from "crypto-js";
import { getJobStatus, getDownloadUrl } from "../api/optimizer";
import { useJob, STAGES } from "../context/JobContext";
import {
  submitHashToBlockchain,
  getBlockchainVerificationStatus,
} from "../api/optimizer";
import {
  getFriendlyError,
  getFriendlyProcessingError,
} from "../utils/errorMessages";

const POLL_INTERVAL_MS = 2500;
const BLOCKCHAIN_POLL_INTERVAL_MS = 5000;
const BLOCKCHAIN_TIMEOUT_MS = 360000;

const hashArrayBuffer = (arrayBuffer) => {
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  return CryptoJS.SHA256(wordArray).toString();
};

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
    file,
    level,
    setVerificationId,
    setVerificationStatus,
  } = useJob();
  const intervalRef = useRef(null);

  const pollBlockchain = async (verificationId) => {
    const start = Date.now();

    const interval = setInterval(async () => {
      try {
        const { data } = await getBlockchainVerificationStatus(verificationId);
        const { status } = data.data;

        if (status === "verified") {
          clearInterval(interval);
          setVerificationStatus("verified");
          setBlockchainResult({
            txHash: data.data.blockchainTxHash,
            etherscanUrl: data.data.blockchainExplorerUrl,
            verifiedAt: data.data.verifiedAt,
          });
          setStage(STAGES.DONE);
        }
        if (status === "failed") {
          clearInterval(interval);
          setVerificationStatus("failed");
          setStage(STAGES.DONE);
        }

        if (Date.now() - start >= BLOCKCHAIN_TIMEOUT_MS) {
          clearInterval(interval);
          setVerificationStatus("timeout");
          setStage(STAGES.DONE);
        }
      } catch {
        clearInterval(interval);
        setVerificationStatus("failed");
        setStage(STAGES.DONE);
      }
    }, BLOCKCHAIN_POLL_INTERVAL_MS);
  };

  const hashAndSubmit = async (downloadUrl) => {
    console.log("hashing......");
    try {
      // 1. Fetch the optimized file buffer from S3
      const response = await fetch(downloadUrl);
      console.log(response);
      const arrayBuffer = await response.arrayBuffer();
      console.log(arrayBuffer);

      // 2. Hash the optimized file
      const documentHash = hashArrayBuffer(arrayBuffer);
      console.log("SHA-256 hash:", documentHash);

      // 3. Submit to blockchain
      const ext = file?.type?.includes("pdf") ? "pdf" : "docx";
      const { data: blockchainData } = await submitHashToBlockchain(
        file?.name ?? `optimized-document.${ext}`,
        documentHash,
        {
          documentType: ext,
          description: `Optimized document - ${level} compression`,
          uploadedBy: "x23351411@student.ncirl.ie",
          timestamp: new Date().toISOString(),
        },
      );

      const vid = blockchainData.data.verificationId;
      setVerificationId(vid);
      setStage(STAGES.VERIFYING);
      pollBlockchain(vid);
    } catch {
      // Blockchain submission failed — still show download, skip verification
      setVerificationStatus("failed");
      setStage(STAGES.DONE);
    }
  };

  useEffect(() => {
    if (stage !== STAGES.PROCESSING || !jobId) return;

    intervalRef.current = setInterval(async () => {
      try {
        const { data } = await getJobStatus(jobId);

        if (data.data.status === "DONE") {
          clearInterval(intervalRef.current);

          const { data: dlData } = await getDownloadUrl(jobId);
          const downloadUrl = dlData.data.downloadUrl;
          setDownloadUrl(downloadUrl);

          // Hash the optimized file and submit to blockchain
          await hashAndSubmit(downloadUrl);
        }

        if (data.data.status === "FAILED") {
          clearInterval(intervalRef.current);
          setErrorMsg(getFriendlyProcessingError(data.data.errorMsg));
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
