import { useEffect, useRef } from "react";
import { getScanAnalysis } from "../api/virusTotal";
import { useJob, STAGES } from "../context/JobContext";

const POLL_INTERVAL_MS = 5000;

export const useScanPoller = () => {
  const { scanAnalysisId, stage, setStage, setScanResult, setErrorMsg } =
    useJob();

  const intervalRef = useRef(null);

  useEffect(() => {
    if (stage !== STAGES.SCANNING || !scanAnalysisId) return;

    intervalRef.current = setInterval(async () => {
      try {
        const { data } = await getScanAnalysis(scanAnalysisId);
        const status = data.data.attributes.status;

        if (status === "completed") {
          clearInterval(intervalRef.current);
          const stats = data.data.attributes.stats;
          setScanResult({
            malicious: stats.malicious,
            suspicious: stats.suspicious,
            harmless: stats.harmless,
            undetected: stats.undetected,
          });
          // Only allow proceeding if file is clean
          if (stats.malicious > 0 || stats.suspicious > 0) {
            setErrorMsg(
              `⚠️ Threat detected: ${stats.malicious} engine(s) flagged this file.`,
            );
            setStage(STAGES.FAILED);
          } else {
            setStage(STAGES.IDLE_SCANNED); // new stage — scan passed, ready to optimise
          }
        }
      } catch (err) {
        clearInterval(intervalRef.current);
        setErrorMsg("Virus scan failed. Please try again.");
        setStage(STAGES.FAILED);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, [stage, scanAnalysisId]);
};
