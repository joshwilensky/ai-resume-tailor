import { diffWords } from "diff";

export default function ResumeDiffView({ original, modified }) {
  const diff = diffWords(original, modified);

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-4 max-h-[500px] overflow-auto text-sm whitespace-pre-wrap leading-relaxed'>
      {diff.map((part, index) => {
        const color = part.added
          ? "bg-green-100 text-green-800"
          : part.removed
          ? "bg-red-100 text-red-800 line-through"
          : "text-gray-800";
        return (
          <span key={index} className={`${color} px-1`}>
            {part.value}
          </span>
        );
      })}
    </div>
  );
}
