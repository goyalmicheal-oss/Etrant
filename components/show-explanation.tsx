import { useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

export default function ShowExplanation({
  explanation,
}: {
  explanation: string | undefined;
}) {
  const [showExplanation, setShowExplanation] = useState(false);
  return (
    <div>
      <Button
        className="bg-gray-950 dark:bg-white rounded-full text-gray-100 dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
        onClick={() => setShowExplanation(true)}
      >
        Explanation
      </Button>

      {showExplanation && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setShowExplanation(false)}
        >
          <div
            className="bg-gray-200 dark:bg-[#1e1e1e] max-w-lg w-full mx-4 p-6 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-950 dark:text-white">
                Explanation
              </h2>
              <button
                onClick={() => setShowExplanation(false)}
                className="text-gray-700 dark:text-gray-400 hover:text-white hover:bg-gray-700 p-1.5 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <p className="text-gray-700 dark:text-gray-300 md:text-lg leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
