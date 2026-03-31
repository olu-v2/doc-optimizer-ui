import { useJob, STAGES } from "../context/JobContext";

export const StatusTracker = () => {
  const { stage, uploadProgress, errorMsg, reset } = useJob();

  if (stage === STAGES.IDLE) return null;

  return (
    <div className="rounded-xl border border-gray-200 p-6 text-center space-y-3">
      {stage === STAGES.UPLOADING && (
        <>
          <p className="text-sm font-medium text-gray-700">
            Uploading... {uploadProgress}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </>
      )}

      {stage === STAGES.SCANNING && (
        <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
          <svg
            className="animate-spin h-5 w-5 text-yellow-500"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          Scanning file for threats...
        </div>
      )}

      {stage === STAGES.IDLE_SCANNED && (
        <p className="text-sm font-medium text-green-600">
          File is clean — ready to optimise!
        </p>
      )}

      {stage === STAGES.PROCESSING && (
        <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
          <svg
            className="animate-spin h-5 w-5 text-blue-500"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          Optimizing your document...
        </div>
      )}

      {stage === STAGES.VERIFYING && (
        <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
          <svg
            className="animate-spin h-5 w-5 text-purple-500"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          Registering document on blockchain...
        </div>
      )}

      {/* {stage === STAGES.DONE && (
        <p className="text-sm font-medium text-green-600">
          ✓ Done! Downloading shortly...
        </p>
      )} */}

      {stage === STAGES.FAILED && (
        <>
          <p className="text-sm text-red-500">{errorMsg}</p>
          <button
            onClick={reset}
            className="text-sm text-blue-600 underline hover:text-blue-800"
          >
            Try again
          </button>
        </>
      )}
    </div>
  );
};
