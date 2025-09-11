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
  CheckCircle,
  XCircle,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  topics: string[];
  difficulty: string;
  wordCount: number;
}

export default function FileAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingMCQ, setIsGeneratingMCQ] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [mcqQuestions, setMcqQuestions] = useState<MCQQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Check file type and size
      const allowedTypes = [
        "text/plain",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a text, PDF, or Word document.",
          variant: "destructive",
        });
        return;
      }

      if (selectedFile.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
      setAnalysisResult(null);
      setMcqQuestions([]);
      setUserAnswers({});
      setShowResults(false);
    }
  };

  // Simulate file analysis with Gemini AI
  const analyzeFile = async () => {
    if (!file) return;

    setIsAnalyzing(true);

    try {
      // Simulate API call to Gemini AI
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock analysis result based on file type
      const mockResult: AnalysisResult = {
        summary:
          "This document covers fundamental concepts in machine learning, including supervised and unsupervised learning algorithms, neural networks, and practical applications in various industries. The content is structured to provide both theoretical understanding and practical implementation guidance.",
        keyPoints: [
          "Introduction to machine learning paradigms",
          "Supervised learning algorithms (regression, classification)",
          "Unsupervised learning techniques (clustering, dimensionality reduction)",
          "Neural networks and deep learning fundamentals",
          "Model evaluation and validation techniques",
          "Real-world applications and case studies",
        ],
        topics: [
          "Machine Learning",
          "Neural Networks",
          "Data Science",
          "Algorithms",
          "Statistics",
        ],
        difficulty: "Intermediate",
        wordCount: Math.floor(Math.random() * 5000) + 2000,
      };

      setAnalysisResult(mockResult);
      toast({
        title: "Analysis complete!",
        description: "Your file has been successfully analyzed.",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description:
          "There was an error analyzing your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate MCQ questions using Gemini AI
  const generateMCQQuestions = async () => {
    if (!analysisResult) return;

    setIsGeneratingMCQ(true);

    try {
      // Simulate API call to Gemini AI for MCQ generation
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Mock MCQ questions based on analysis
      const mockQuestions: MCQQuestion[] = [
        {
          id: 1,
          question:
            "What is the primary difference between supervised and unsupervised learning?",
          options: [
            "Supervised learning uses labeled data, unsupervised learning uses unlabeled data",
            "Supervised learning is faster than unsupervised learning",
            "Supervised learning only works with numerical data",
            "There is no significant difference between them",
          ],
          correctAnswer: 0,
          explanation:
            "Supervised learning algorithms learn from labeled training data to make predictions, while unsupervised learning finds patterns in data without labeled examples.",
          difficulty: "Easy",
        },
        {
          id: 2,
          question:
            "Which of the following is NOT a common evaluation metric for classification models?",
          options: ["Accuracy", "Precision", "Mean Squared Error", "F1-Score"],
          correctAnswer: 2,
          explanation:
            "Mean Squared Error is typically used for regression problems, not classification. Classification models use metrics like accuracy, precision, recall, and F1-score.",
          difficulty: "Medium",
        },
        {
          id: 3,
          question:
            "In neural networks, what is the purpose of the activation function?",
          options: [
            "To initialize weights randomly",
            "To introduce non-linearity into the model",
            "To reduce overfitting",
            "To normalize input data",
          ],
          correctAnswer: 1,
          explanation:
            "Activation functions introduce non-linearity into neural networks, allowing them to learn complex patterns and relationships in data that linear models cannot capture.",
          difficulty: "Medium",
        },
        {
          id: 4,
          question:
            "What technique is commonly used to prevent overfitting in machine learning models?",
          options: [
            "Increasing the learning rate",
            "Adding more features",
            "Cross-validation and regularization",
            "Using smaller datasets",
          ],
          correctAnswer: 2,
          explanation:
            "Cross-validation helps assess model performance on unseen data, while regularization techniques (L1, L2) add penalties to prevent the model from becoming too complex.",
          difficulty: "Hard",
        },
        {
          id: 5,
          question:
            "Which clustering algorithm requires you to specify the number of clusters beforehand?",
          options: [
            "DBSCAN",
            "Hierarchical clustering",
            "K-means",
            "Mean shift",
          ],
          correctAnswer: 2,
          explanation:
            "K-means clustering requires you to specify the number of clusters (k) as a parameter before running the algorithm, unlike DBSCAN or hierarchical clustering.",
          difficulty: "Easy",
        },
      ];

      setMcqQuestions(mockQuestions);
      toast({
        title: "Questions generated!",
        description: `${mockQuestions.length} MCQ questions have been created based on your file.`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description:
          "There was an error generating questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingMCQ(false);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    if (showResults) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  // Calculate and show results
  const showQuizResults = () => {
    const correctAnswers = mcqQuestions.filter(
      (q) => userAnswers[q.id] === q.correctAnswer,
    ).length;
    setScore(correctAnswers);
    setShowResults(true);

    toast({
      title: "Quiz completed!",
      description: `You scored ${correctAnswers} out of ${mcqQuestions.length} questions.`,
    });
  };

  // Reset quiz
  const resetQuiz = () => {
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
  };

  // Get difficulty color for dark theme
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Hard":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 w-full">
      {/* Hero Section with Geometric Background */}
      <div className="relative pt-24 pb-12 overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-black text-gray-950 dark:text-white">
              AI File Analyzer
            </h1>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Upload your notes or books and get AI-powered analysis with custom
            MCQ questions to test your knowledge
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-12 space-y-8">
        {/* File Upload Section */}
        <Card className="bg-indigo-200/30 dark:bg-gray-800 border-indigo-200 dark:border-gray-700">
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
                <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
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
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
        {analysisResult && (
          <Card className="bg-indigo-200/30 dark:bg-gray-800 border-indigo-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex text-lg md:text-xl items-center gap-2 text-gray-950 dark:text-white">
                <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                AI Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary */}
              <div>
                <h3 className="font-semibold mb-2 text-gray-950 dark:text-white">
                  Summary
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>

              {/* Key Points */}
              <div>
                <h3 className="font-semibold mb-2 text-gray-950 dark:text-white">
                  Key Points
                </h3>
                <ul className="space-y-2">
                  {analysisResult.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Topics and Stats */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-gray-700 dark:text-white">
                    Topics Covered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.topics.map((topic, index) => (
                      <Badge
                        key={index}
                        className="bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-400">
                      Difficulty Level:
                    </span>
                    <Badge
                      className={getDifficultyColor(analysisResult.difficulty)}
                    >
                      {analysisResult.difficulty}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-400">
                      Word Count:
                    </span>
                    <span className="font-medium text-gray-950 dark:text-white">
                      {analysisResult.wordCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Generate MCQ Button */}
              <div className="pt-4 border-t border-gray-300 dark:border-gray-700">
                <Button
                  onClick={generateMCQQuestions}
                  disabled={isGeneratingMCQ}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {isGeneratingMCQ ? (
                    <>
                      <Brain className="h-4 w-4 mr-2 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate MCQ Questions
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* MCQ Questions */}
        {mcqQuestions.length > 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <BookOpen className="h-5 w-5 text-green-400" />
                  Practice Questions ({mcqQuestions.length})
                </CardTitle>
                <div className="flex gap-2">
                  {showResults && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
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
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Retry
                    </Button>
                  )}
                </div>
              </div>
              <CardDescription className="text-gray-400">
                Test your understanding with AI-generated questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  {mcqQuestions.map((question, questionIndex) => (
                    <div
                      key={question.id}
                      className="border border-gray-700 rounded-lg p-4 space-y-4 bg-gray-800/50"
                    >
                      {/* Question Header */}
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-medium text-lg leading-relaxed text-white">
                          {questionIndex + 1}. {question.question}
                        </h3>
                        <Badge
                          className={getDifficultyColor(question.difficulty)}
                        >
                          {question.difficulty}
                        </Badge>
                      </div>

                      {/* Options */}
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => {
                          const isSelected =
                            userAnswers[question.id] === optionIndex;
                          const isCorrect =
                            optionIndex === question.correctAnswer;
                          const isWrong =
                            showResults && isSelected && !isCorrect;
                          const shouldHighlight = showResults && isCorrect;

                          return (
                            <button
                              key={optionIndex}
                              onClick={() =>
                                handleAnswerSelect(question.id, optionIndex)
                              }
                              disabled={showResults}
                              className={`w-full text-left p-3 rounded-lg border transition-all ${
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
                                          : "border-gray-500 text-gray-400"
                                  }`}
                                >
                                  {String.fromCharCode(65 + optionIndex)}
                                </span>
                                <span className="flex-1 text-gray-300">
                                  {option}
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
                        <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border-l-4 border-blue-500">
                          <p className="text-sm text-blue-300">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
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
