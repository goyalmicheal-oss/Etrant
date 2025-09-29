"use client";
import { useState } from "react";

import { BookOpen, RotateCcw } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import McqQuestion from "./mcq-question";
import { Button } from "../ui/button";
import { QuestionData } from "@/types";

export default function FileMCQ({
  questions,
  file,
}: {
  questions: QuestionData[];
  file: string;
}) {
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Handle answer selection
  const handleAnswerSelect = (question: string, answerIndex: number) => {
    if (showResults) return;
    setUserAnswers((prev) => ({
      ...prev,
      [question]: answerIndex,
    }));
  };

  // Calculate and show results
  const showQuizResults = () => {
    const correctAnswers = questions.filter(
      (q) => userAnswers[q.question] === q.correctAnswer,
    ).length;
    setScore(correctAnswers);
    setShowResults(true);
  };

  // Reset quiz
  const resetQuiz = () => {
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
  };
  return (
    <Card className="border-none">
      <CardHeader>
        <h2 className="text-2xl font-semibold dark:text-gray-100 text-gray-950 mb-2">
          {file}
        </h2>
        <div className="flex max-md:flex-col md:items-center md:justify-between">
          <CardTitle className="flex text-lg md:text-xl items-center gap-2 text-gray-900 dark:text-gray-100">
            <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
            Practice Questions ({questions.length})
          </CardTitle>
          <div className="flex gap-2">
            {showResults && (
              <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                Score: {score}/{questions.length}
              </Badge>
            )}
            {Object.keys(userAnswers).length === questions.length &&
              !showResults && (
                <Button
                  onClick={showQuizResults}
                  size="sm"
                  className="text-gray-100 bg-blue-600 hover:bg-blue-700"
                >
                  Show Results
                </Button>
              )}
            {showResults && (
              <Button
                onClick={resetQuiz}
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </div>
        <CardDescription className="text-gray-700 dark:text-gray-400">
          Test your understanding with AI-generated questions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {questions.map((question, questionIndex) => (
            <McqQuestion
              key={questionIndex}
              handleAnswerSelect={handleAnswerSelect}
              question={question}
              userAnswers={userAnswers}
              showResults={showResults}
              questionIndex={questionIndex}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
