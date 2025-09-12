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

      // Mock MCQ questions based on analysis
      const mockQuestions: IMCQQuestion[] = [
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
