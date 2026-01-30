export default function DownloadButton({ url }) {
  return (
    <a
      href={url}
      className="block w-full text-center bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
    >
      Download Optimized File
    </a>
  );
}
