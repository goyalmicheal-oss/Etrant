import { getDifficultyColor } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { QuestionData } from "@/types";

interface McqQuestionProps {
  question: QuestionData;
  questionIndex: number;
  userAnswers: { [key: string]: number };
  showResults: boolean;
  handleAnswerSelect: (question: string, answerIndex: number) => void;
}

export default function McqQuestion({
  question,
  questionIndex,
  userAnswers,
  showResults,
  handleAnswerSelect,
}: McqQuestionProps) {
  return (
    <div className="border border-gray-700 rounded-lg p-4 space-y-4 bg-gray-200 dark:bg-gray-800/50">
      {/* Question Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <h3 className="font-medium md:text-lg leading-relaxed text-gray-950 dark:text-white">
          {questionIndex + 1}. {question.question}
        </h3>
        <Badge
          className={` border border-gray-700 ${getDifficultyColor(question.difficulty)}`}
        >
          {question.difficulty}
        </Badge>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option, optionIndex) => {
          const isSelected = userAnswers[question.question] === optionIndex;
          const isCorrect = optionIndex === question.correctAnswer;
          const isWrong = showResults && isSelected && !isCorrect;
          const shouldHighlight = showResults && isCorrect;

          return (
            <button
              key={optionIndex}
              onClick={() => handleAnswerSelect(question.question, optionIndex)}
              disabled={showResults}
              className={`w-full text-left p-3 rounded-full border transition-all ${
                isSelected && !showResults
                  ? "border-blue-500 bg-blue-500/10"
                  : shouldHighlight
                    ? "border-green-500 bg-green-500/10"
                    : isWrong
                      ? "border-red-500 bg-red-500/10"
                      : "border-gray-600 hover:border-gray-500 hover:bg-gray-700/50"
              } ${showResults ? "cursor-default" : "cursor-pointer"}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                    shouldHighlight
                      ? "border-green-500 bg-green-500 text-white"
                      : isWrong
                        ? "border-red-500 bg-red-500 text-white"
                        : isSelected
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-indigo-500 bg-indigo-700 text-gray-100"
                  }`}
                >
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                <span className="flex-1 max-md:text-sm text-gray-700 dark:text-gray-300">
                  {option.name}
                </span>
                {showResults && shouldHighlight && (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                )}
                {showResults && isWrong && (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showResults && (
        <div className="mt-4 p-3 rounded-lg border-l-4 border-indigo-500 bg-indigo-500/10">
          <p className="text-sm dark:text-indigo-300 text-indigo-900">
            <strong>Explanation:</strong> {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
