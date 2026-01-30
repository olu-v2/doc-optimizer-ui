import { useState } from "react";
import FileUpload from "../components/FileUpload";
import StatusBadge from "../components/StatusBadge";
import DownloadButton from "../components/DownloadButton";

export default function Home() {
  const [status, setStatus] = useState("idle");
  const [fileName, setFileName] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);

  return (
    <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-2">
        Document Optimizer
      </h1>
      <p className="text-gray-500 text-center mb-6">
        Upload a document and receive an optimized version
      </p>

      {/* Upload */}
      <FileUpload
        setStatus={setStatus}
        setFileName={setFileName}
        setDownloadUrl={setDownloadUrl}
      />

      {/* File info */}
      {fileName && <p className="text-sm text-gray-600 mb-2">📄 {fileName}</p>}

      {/* Status */}
      <StatusBadge status={status} />

      {/* Download */}
      {status === "ready" && downloadUrl && (
        <DownloadButton url={downloadUrl} />
      )}
    </div>
  );
}
