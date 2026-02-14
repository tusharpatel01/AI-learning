import { useState } from "react";
import { Star } from "lucide-react";

const Flashcard = ({ card, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!card) return null;

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="w-full flex justify-center">
      <div
        onClick={handleFlip}
        className="relative w-full max-w-xl min-h-[260px] cursor-pointer perspective-[1200px]"
      >
        {/* Star Button */}
        {onToggleStar && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(card._id);
            }}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/80 backdrop-blur border border-slate-200 hover:bg-yellow-50"
          >
            <Star
              size={18}
              className={
                card.isStarred
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-slate-400"
              }
            />
          </button>
        )}

        {/* Card Container */}
        <div
          className={`relative w-full min-h-[260px] rounded-3xl border border-slate-200 bg-white shadow-md transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front Side */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 backface-hidden">
            <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-3">
              Question
            </h3>

            <p className="text-xl font-semibold text-slate-900 text-center">
              {card.question || "No question text"}
            </p>

            <p className="mt-6 text-xs text-slate-400">
              Click to reveal answer
            </p>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 backface-hidden rotate-y-180 bg-slate-50 rounded-3xl">
            <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-3">
              Answer
            </h3>

            <p className="text-lg text-slate-900 text-center">
              {card.answer || "No answer text"}
            </p>

            <p className="mt-6 text-xs text-slate-400">
              Click to go back
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
