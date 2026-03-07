import { JobProvider } from "./context/JobContext";
import { FileDropzone } from "./components/FIleDropzone";
import { LevelSelector } from "./components/LevelSelector";
import { UploadButton } from "./components/UploadButton";
import { StatusTracker } from "./components/StatusTracker";
import { DownloadButton } from "./components/DownloadButton";
import { useJobPoller } from "./hooks/useJobPoller";

const AppInner = () => {
  useJobPoller();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Document Optimizer
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload a PDF or DOCX and choose your quality level.
          </p>
        </div>
        <FileDropzone />
        <LevelSelector />
        <UploadButton />
        <StatusTracker />
        <DownloadButton />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <JobProvider>
      <AppInner />
    </JobProvider>
  );
}
