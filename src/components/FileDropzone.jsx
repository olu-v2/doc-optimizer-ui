import { useRef } from "react";
import { useJob, STAGES } from "../context/JobContext";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const FileDropzone = () => {
  const { file, setFile, stage } = useJob();
  const inputRef = useRef(null);
  const disabled = stage !== STAGES.IDLE;

  const handleFile = (f) => {
    if (!f) return;
    if (!ACCEPTED_TYPES.includes(f.type)) {
      alert("Only PDF and DOCX files are supported.");
      return;
    }
    setFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => !disabled && inputRef.current.click()}
      className={`border-2 border-dashed rounded-xl p-10 text-center transition cursor-pointer
        ${disabled ? "opacity-50 cursor-not-allowed border-gray-300" : "border-blue-400 hover:bg-blue-50"}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      {file ? (
        <p className="text-sm text-gray-700 font-medium">{file.name}</p>
      ) : (
        <>
          <p className="text-gray-500 text-sm">
            Drag & drop a PDF or DOCX file here
          </p>
          <p className="text-gray-400 text-xs mt-1">or click to browse</p>
        </>
      )}
    </div>
  );
};
