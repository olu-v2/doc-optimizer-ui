import { uploadDocument } from "../services/api";

export default function FileUpload({ setStatus, setFileName, setDownloadUrl }) {
  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setStatus("uploading");

    try {
      setStatus("processing");
      const url = await uploadDocument(file);
      setDownloadUrl(url);
      setStatus("ready");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <label className="block w-full mb-4">
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition">
        <p className="text-gray-600">Click to upload or drag & drop</p>
        <p className="text-xs text-gray-400 mt-1">PDF, DOCX, TXT</p>
      </div>
      <input type="file" className="hidden" onChange={handleChange} />
    </label>
  );
}
