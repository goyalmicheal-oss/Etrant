import { Badge, Brain, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import { getDifficultyColor } from "@/lib/utils";
import { IAnalysisResult } from "@/types";

interface IMCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

interface FileAnalysisProps {
  analysisResult: IAnalysisResult | null;
}

export default function FileAnalysis({ analysisResult }: FileAnalysisProps) {
  const [isGeneratingMCQ, setIsGeneratingMCQ] = useState(false);
  const generateMCQQuestions = async () => {
    if (!analysisResult) return;

    setIsGeneratingMCQ(true);

    try {
      // Simulate API call to Gemini AI for MCQ generation
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // toast({
      //   title: "Questions generated!",
      // description: `${mockQuestions.length} MCQ questions have been created based on your file.`,
      // });
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
  return (
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
            {analysisResult?.summary}
          </p>
        </div>

        {/* Key Points */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-950 dark:text-white">
            Key Points
          </h3>
          <ul className="space-y-2">
            {analysisResult?.keyPoints.map((point, index) => (
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
              {analysisResult?.topics?.map((topic, index) => (
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
                className={getDifficultyColor(
                  analysisResult?.difficulty as string,
                )}
              >
                {analysisResult?.difficulty}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-400">
                Word Count:
              </span>
              <span className="font-medium text-gray-950 dark:text-white">
                {analysisResult?.wordCount?.toLocaleString()}
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
  );
}
