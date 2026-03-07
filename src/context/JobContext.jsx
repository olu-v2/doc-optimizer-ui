import { createContext, useContext, useState } from "react";

const JobContext = createContext(null);

export const STAGES = {
  IDLE: "IDLE",
  UPLOADING: "UPLOADING",
  PROCESSING: "PROCESSING",
  DONE: "DONE",
  VERIFYING: "VERIFYING",
  FAILED: "FAILED",
};

export const JobProvider = ({ children }) => {
  const [stage, setStage] = useState(STAGES.IDLE);
  const [file, setFile] = useState(null);
  const [level, setLevel] = useState("medium");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [jobId, setJobId] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [blockchainResult, setBlockchainResult] = useState(null);

  const reset = () => {
    setDisabled(false);
    setStage(STAGES.IDLE);
    setFile(null);
    setLevel("medium");
    setUploadProgress(0);
    setJobId(null);
    setDownloadUrl(null);
    setErrorMsg(null);
    setVerificationId(null);
    setBlockchainResult(null);
  };

  return (
    <JobContext.Provider
      value={{
        stage,
        setStage,
        file,
        setFile,
        level,
        setLevel,
        uploadProgress,
        setUploadProgress,
        jobId,
        setJobId,
        downloadUrl,
        setDownloadUrl,
        errorMsg,
        setErrorMsg,
        reset,
        disabled,
        setDisabled,
        verificationId,
        setVerificationId,
        blockchainResult,
        setBlockchainResult,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJob = () => useContext(JobContext);
