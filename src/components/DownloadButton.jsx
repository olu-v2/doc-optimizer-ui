import { useEffect } from "react";
import { useJob, STAGES } from "../context/JobContext";

const VerificationBadge = ({ verificationStatus, blockchainResult }) => {
  if (verificationStatus === "verified" && blockchainResult) {
    return (
      <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 space-y-1">
        <p className="text-xs font-semibold text-purple-700">
          ✓ Blockchain Verified
        </p>
        <p className="text-xs text-gray-500">
          Verified at {new Date(blockchainResult.verifiedAt).toLocaleString()}
        </p>
        <a
          href={blockchainResult.etherscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-purple-600 underline hover:text-purple-800 break-all"
        >
          View on Etherscan →
        </a>
      </div>
    );
  }

  if (verificationStatus === "timeout") {
    return (
      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-xs font-semibold text-yellow-700">
          ⏳ Verification Pending
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Blockchain confirmation is taking longer than expected. Your document
          is still valid.
        </p>
      </div>
    );
  }

  if (verificationStatus === "failed") {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs font-semibold text-gray-600">
          ⚠ Verification Unavailable
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Blockchain verification could not be completed. Your optimized
          document is unaffected.
        </p>
      </div>
    );
  }

  return null;
};

export const DownloadButton = () => {
  const {
    stage,
    downloadUrl,
    file,
    blockchainResult,
    verificationStatus,
    reset,
  } = useJob();

  useEffect(() => {
    if (stage === STAGES.DONE && downloadUrl) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.download = file?.name ?? "optimized-document";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [stage, downloadUrl]);

  if (stage !== STAGES.DONE || !downloadUrl) return null;

  return (
    <div className="space-y-3">
      <a
        href={downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        download={file?.name ?? "optimized-document"}
        className="block w-full text-center py-3 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 transition"
      >
        Download Optimized File
      </a>

      <VerificationBadge
        verificationStatus={verificationStatus}
        blockchainResult={blockchainResult}
      />

      <button
        onClick={reset}
        className="w-full py-3 rounded-xl font-semibold text-gray-600 border border-gray-300 hover:bg-gray-50 transition"
      >
        Optimize Another Document
      </button>
    </div>
  );
};
