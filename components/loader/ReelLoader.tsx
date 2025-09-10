"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface WikipediaAILoaderProps {
  totalArticles: number;
  loadingTime: number;
}

const loadingMessages = [
  "Searching...",
  "Fetching content...",
  "Processing with AI...",
  "Summarizing...",
];

export function AILoader({
  totalArticles,
  loadingTime,
}: WikipediaAILoaderProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [articleNumber, setArticleNumber] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(
      () => {
        setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      },
      (loadingTime * 1000) / 2,
    );

    const articleNumberInterval = setInterval(
      () => {
        setArticleNumber((prev) => prev + 1);
      },
      (loadingTime * 1000) / totalArticles,
    );

    const progressInterval = setInterval(
      () => {
        setProgress((prev) => Math.min(prev + Math.random() * 5, 95));
      },
      (loadingTime * 1000) / 30,
    );

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearInterval(articleNumberInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-gray-950 backdrop-blur-sm flex items-center justify-center z-30">
      <Card className="w-full max-w-md p-8 space-y-6 bg-transparent border-transparent animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-500 animate-spin"
                style={{ animationDuration: "3s" }}
              />
              <div
                className="absolute inset-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 animate-spin"
                style={{
                  animationDuration: "2s",
                  animationDirection: "reverse",
                }}
              />
              <div className="absolute inset-2 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse">
                  <div className="absolute inset-1 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-ping" />
                  </div>
                </div>
              </div>
              <div
                className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full animate-bounce opacity-60"
                style={{ animationDelay: "0s" }}
              />
              <div
                className="absolute -bottom-2 -left-2 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-60"
                style={{ animationDelay: "0.5s" }}
              />
              <div
                className="absolute top-0 -left-3 w-2 h-2 bg-cyan-400 rounded-full animate-bounce opacity-60"
                style={{ animationDelay: "1s" }}
              />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-950 dark:text-white animate-in slide-in-from-bottom-2 duration-500">
            Processing {totalArticles} Reels
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-400 animate-in slide-in-from-bottom-2 duration-500 delay-100">
            Estimated time: {loadingTime}s
          </p>
        </div>

        {/* Progress Section */}
        <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-500 delay-200">
          <p className="w-full text-right text-gray-950 dark:text-white">
            {articleNumber > totalArticles ? totalArticles - 1 : articleNumber}\
            {totalArticles}
          </p>
          <div className="relative">
            <Progress
              value={progress}
              className="h-3 bg-gray-400 dark:bg-gray-800"
            />
            <div
              className="absolute top-0 left-0 h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-full animate-pulse opacity-75" />
            </div>
          </div>
        </div>

        {/* Current Step */}
        <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-500 delay-300">
          <div className="text-sm font-medium text-gray-950 dark:text-white text-center transition-all duration-300">
            {loadingMessages[currentMessageIndex]}
          </div>
        </div>
      </Card>
    </div>
  );
}
