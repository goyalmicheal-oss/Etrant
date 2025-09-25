"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  FileText,
  Brain,
  RotateCcw,
  BookOpen,
  HistoryIcon,
} from "lucide-react";
import { toast } from "sonner";
import { IAnalysisResult } from "@/types";
import McqQuestion from "@/components/file-analyzer/mcq-question";
import FileAnalysis from "@/components/file-analyzer/Analysis";
import { useUserStore } from "@/lib/store/useUserStore";
import { QuestionData } from "@/types";
import Link from "next/link";

export default function FileAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<IAnalysisResult | null>(
    null,
  );
  const [mcqQuestions, setMcqQuestions] = useState<QuestionData[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUserStore();

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = [
        "text/plain",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Invalid file type");
        return;
      }
      if (selectedFile.size > maxSize) {
        toast.error("File too large");
        return;
      }
      setFile(selectedFile);
      setAnalysisResult(null);
      setMcqQuestions([]);
      setUserAnswers({});
      setShowResults(false);
    }
  };

  const analyzeFile = async () => {
    if (!file) return;

    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", user?.interest!);
    formData.append("language", user?.language || "English");
    formData.append("userId", user?.id!);
    formData.append("fileName", file.name);

    try {
      const res = await fetch("/api/file-analyzer", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Failed to analyze file");
      }

      const data = await res.json();

      if (data.success && data.questions) {
        setMcqQuestions(data.questions);
        toast.success("Your file has been successfully analyzed!");
      } else {
        toast.error("No questions generated. Try again with another file.");
      }
    } catch (error) {
      console.error(error);
      toast.error("There was an error analyzing your file. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

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
    const correctAnswers = mcqQuestions.filter(
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 w-full">
      {/* Hero Section with Geometric Background */}
      <div className="relative pt-24 pb-12 overflow-hidden">
        <div className="w-full flex justify-end px-6 md:px-24">
          <Link
            href={"file-analyzer/files"}
            className="flex justify-items-center gap-2 text-gray-300 md:px-4 p-2 md:py-2 rounded-lg bg-gray-800 hover:bg-indigo-600 duration-200"
          >
            <HistoryIcon className="w-5 h-5 md:w-6 md:h-6" />
            <span className="max-md:hidden">File History</span>
          </Link>
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Brain className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-gray-950 dark:text-white">
              AI File Analyzer
            </h1>
          </div>
          <p className="text-sm md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Upload your notes or books and get AI-powered analysis with custom
            MCQ questions to test your knowledge
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-12 space-y-8">
        {/* File Upload Section */}
        <Card className="bg-indigo-200/30 dark:bg-gray-900 border-indigo-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex text-lg md:text-xl items-center gap-2 text-gray-950 dark:text-white">
              <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Upload Your File
            </CardTitle>
            <CardDescription className="text-gray-700 dark:text-gray-400">
              Upload text files, PDFs, or Word documents (max 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-300/50 dark:bg-gray-800/50"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="h-12 w-12 mx-auto text-indigo-600 dark:text-gray-400 mb-4" />
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-500">
                  Supports: TXT, PDF, DOC, DOCX
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {file && (
                <div className="flex flex-wrap gap-2 items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <p className="font-medium text-gray-950 dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={analyzeFile}
                    disabled={isAnalyzing}
                    className="text-white bg-gradient-to-r w-full from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <Brain className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Analyze with AI
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResult && <FileAnalysis analysisResult={analysisResult} />}

        {/* MCQ Questions */}
        {mcqQuestions.length > 0 && (
          <Card className="bg-indigo-200/20 dark:bg-gray-900 border-indigo-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex max-md:flex-col md:items-center md:justify-between">
                <CardTitle className="flex text-lg md:text-xl items-center gap-2 text-gray-950 dark:text-white">
                  <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Practice Questions ({mcqQuestions.length})
                </CardTitle>
                <div className="flex gap-2">
                  {showResults && (
                    <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                      Score: {score}/{mcqQuestions.length}
                    </Badge>
                  )}
                  {Object.keys(userAnswers).length === mcqQuestions.length &&
                    !showResults && (
                      <Button
                        onClick={showQuizResults}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
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
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  {mcqQuestions.map((question, questionIndex) => (
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
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
