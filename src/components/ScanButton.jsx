import { useJob, STAGES } from "../context/JobContext";
import { hashFile, checkFileHash, uploadFileForScan } from "../api/virusTotal";

export const ScanButton = () => {
  const { file, stage, setStage, setScanAnalysisId, setScanResult } = useJob();

  const disabled = stage !== STAGES.IDLE || !file;

  const handleScan = async () => {
    try {
      setStage(STAGES.SCANNING);

      // Step 1: Hash the file and check if VT already has it
      const hash = await hashFile(file);
      try {
        const { data } = await checkFileHash(hash);
        const stats = data.data.attributes.last_analysis_stats;
        if (stats.malicious > 0 || stats.suspicious > 0) {
          throw new Error(
            `Threat detected: ${stats.malicious} engine(s) flagged this file.`,
          );
        }
        // Already known and clean — skip straight to ready
        setStage(STAGES.IDLE_SCANNED);
        return;
      } catch (err) {
        // 404 means file not seen before — upload for fresh scan
        if (err?.response?.status !== 404) throw err;
      }

      // Step 2: Upload for fresh scan
      const { data: uploadData } = await uploadFileForScan(file);
      setScanAnalysisId(uploadData.data.id);
      // Stage remains SCANNING — useScanPoller takes over
    } catch (err) {
      setStage(STAGES.FAILED);
    }
  };

  return (
    <button
      onClick={handleScan}
      disabled={disabled}
      className={`w-full py-3 rounded-xl font-semibold text-white transition ${
        disabled
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-yellow-500 hover:bg-yellow-600"
      }`}
    >
      🔍 Scan for Viruses
    </button>
  );
};
