import { useJob, STAGES } from "../context/JobContext";
import {
  requestUploadUrl,
  uploadFileToS3,
  startProcessing,
} from "../api/optimizer";
import { getFriendlyError } from "../utils/errorMessages";

export const UploadButton = () => {
  const {
    file,
    level,
    stage,
    setStage,
    setUploadProgress,
    setJobId,
    setErrorMsg,
    setVerificationId,
  } = useJob();

  const disabled = stage !== STAGES.IDLE_SCANNED || !file;

  const handleUpload = async () => {
    try {
      setStage(STAGES.UPLOADING);

      // 1. Get presigned upload URL + jobId
      const { data: responseBody } = await requestUploadUrl(file.type, level);
      console.log(responseBody);
      const { uploadUrl, key, jobId } = responseBody.data;
      setJobId(jobId);

      // 2. Upload file directly to S3
      await uploadFileToS3(uploadUrl, file, setUploadProgress);

      // 3. Trigger processing Lambda
      await startProcessing(key, level, jobId);
      setStage(STAGES.PROCESSING);
    } catch (err) {
      setErrorMsg(getFriendlyError(err));
      setStage(STAGES.FAILED);
    }
  };

  return (
    <button
      onClick={handleUpload}
      disabled={disabled}
      className={`w-full py-3 rounded-xl font-semibold text-white transition
        ${disabled ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
      `}
    >
      Optimize Document
    </button>
  );
};
