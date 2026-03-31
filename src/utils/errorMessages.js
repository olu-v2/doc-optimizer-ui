const ERROR_MESSAGES = {
  UNAUTHORIZED: "Access denied. Invalid API key.",
  FORBIDDEN: "Access denied. Please contact support.",
  KEY_EXPIRED: "Your API key has expired. Please contact support.",
  RATE_LIMITED: "Too many requests. Please wait a moment and try again.",
  INVALID_OPTIMIZATION_LEVEL: "Please select a valid optimization level.",
  PROCESSING_FAILED: "Processing failed. Please try again.",
  JOB_NOT_FOUND: "Job not found. Please try uploading again.",
  FILE_NOT_READY: "Your file is not ready yet.",
};

export const getFriendlyProcessingError = (rawMessage) => {
  if (!rawMessage) return "Processing failed. Please try again.";
  if (rawMessage.toLowerCase().includes("extension"))
    return "File type not supported by the processor.";
  if (rawMessage.toLowerCase().includes("size"))
    return "File is too large to process.";
  if (rawMessage.toLowerCase().includes("timeout"))
    return "Processing timed out. Please try again.";
  return rawMessage; // show as-is for anything else
};

const FALLBACK = "Something went wrong. Please try again.";

export const getFriendlyError = (err) => {
  console.log(err);
  const code = err?.response?.data?.error?.code;
  return ERROR_MESSAGES[code] ?? FALLBACK;
};
