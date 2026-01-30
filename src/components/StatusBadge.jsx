const map = {
  idle: {
    text: "Waiting for upload",
    style: "bg-gray-100 text-gray-600",
  },
  uploading: {
    text: "Uploading document...",
    style: "bg-blue-100 text-blue-700",
  },
  processing: {
    text: "Optimizing document...",
    style: "bg-yellow-100 text-yellow-700",
  },
  ready: {
    text: "Document ready!",
    style: "bg-green-100 text-green-700",
  },
  error: {
    text: "Something went wrong",
    style: "bg-red-100 text-red-700",
  },
};

export default function StatusBadge({ status }) {
  const s = map[status];

  return (
    <div className={`rounded-lg p-3 text-center mb-4 ${s.style}`}>{s.text}</div>
  );
}
