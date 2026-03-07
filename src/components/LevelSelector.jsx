import { useJob, STAGES } from "../context/JobContext";

const LEVELS = [
  {
    value: "low",
    label: "Low",
    description: "Minimal compression, largest file",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Balanced quality and size",
  },
  {
    value: "high",
    label: "High",
    description: "Maximum compression, smallest file",
  },
];

export const LevelSelector = () => {
  const { level, setLevel, stage } = useJob();
  const disabled = stage !== STAGES.IDLE;

  return (
    <div className="flex gap-3">
      {LEVELS.map((l) => (
        <button
          key={l.value}
          onClick={() => !disabled && setLevel(l.value)}
          className={`flex-1 rounded-xl border p-4 text-left transition
            ${level === l.value ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <p className="font-semibold text-sm text-gray-800">{l.label}</p>
          <p className="text-xs text-gray-500 mt-1">{l.description}</p>
        </button>
      ))}
    </div>
  );
};
