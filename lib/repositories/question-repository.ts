import { GoogleGenAI } from "@google/genai";
import { IWikipediaRepository, QuestionData } from "@/types";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});

export class QuestionRepository implements IWikipediaRepository {
  private static instance: QuestionRepository;

  public static getInstance(): QuestionRepository {
    if (!QuestionRepository.instance) {
      QuestionRepository.instance = new QuestionRepository();
    }
    return QuestionRepository.instance;
  }

  async getAIQuestions(prompt: string): Promise<QuestionData[]> {
    try {
      const response = await ai.models.generateContent({
        // model: "gemini-1.5-flash-latest",
        model: "gemini-2.5-flash-lite",
        contents: [
          {
            parts: [
              {
                text: prompt,
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
        error: error instanceof Error ? error.message : error,
      });
      throw new Error("Failed to generate questions");
    }
  }
}

// Singleton instance
export const AIQuestions = QuestionRepository.getInstance();
