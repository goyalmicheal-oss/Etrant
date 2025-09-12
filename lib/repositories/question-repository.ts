import { InterestCategory } from "@/types";
import { GoogleGenAI } from "@google/genai";
import { generateQuestionPrompt } from "../prompts/generate-questions";

interface OptionType {
  name: string;
  isCorrect: boolean;
}

export interface QuestionData {
  question: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  tags: string[];
  context: string;
  estimatedTime: number;
  options: OptionType[];
  correctAnswer: number;
  explanation?: string;
  previousYearQuestion: string;
  metadata: {
    source: string;
    complexity: number;
    bloomsLevel:
      | "remember"
      | "understand"
      | "apply"
      | "analyze"
      | "evaluate"
      | "create";
    learningObjective?: string;
  };
}

export interface IWikipediaRepository {
  getAIQuestions(category: string): Promise<QuestionData[]>;
}

// Initialize AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY, // Make sure to set this in your .env.local
});

export class QuestionRepository implements IWikipediaRepository {
  private static instance: QuestionRepository;

  public static getInstance(): QuestionRepository {
    if (!QuestionRepository.instance) {
      QuestionRepository.instance = new QuestionRepository();
    }
    return QuestionRepository.instance;
  }

  async getAIQuestions(category: InterestCategory): Promise<QuestionData[]> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash-latest",
        // model: "gemini-2.0-flash-exp",
        contents: [
          {
            parts: [
              {
                text: generateQuestionPrompt(category),
              },
            ],
          },
        ],
      });

      const responseText = response.text;
      // Parse the JSON response
      let questions: QuestionData[];

      try {
        // Clean the response text to extract JSON
        const cleanedResponse = responseText!
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();

        questions = JSON.parse(cleanedResponse);

        // Validate that it's an array
        if (!Array.isArray(questions)) {
          throw new Error("Response is not an array");
        }

        // Validate each question has required fields
        questions.forEach((q, index) => {
          if (
            !q.question ||
            !q.difficulty ||
            !q.category ||
            !q.options ||
            q.correctAnswer === undefined
          ) {
            throw new Error(`Question ${index} is missing required fields`);
          }
        });
        console.log("question length", questions.length);
        return questions;
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        throw new Error("Invalid JSON response from AI");
      }
    } catch (error) {
      console.error("AI question generation failed:", {
        category,
        error: error instanceof Error ? error.message : error,
      });
      throw new Error("Failed to generate questions");
    }
  }
}

// Singleton instance
export const AIQuestions = QuestionRepository.getInstance();
