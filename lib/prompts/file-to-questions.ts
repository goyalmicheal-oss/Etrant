import { InterestCategory } from "@/types";

export default function fileToQuestionsPrompt(
  category: InterestCategory,
  language: string,
  content: string,
) {
  return `
You are an expert question setter for competitive exams.  
Your task is to generate high-quality multiple-choice questions (MCQs) based strictly on the INPUT DATA provided.  

⚠️ RULES (follow exactly):
1. Output must be **valid JSON only** — no explanations, no prose, no markdown.  
2. Each MCQ object must strictly follow this schema:

{
  "question": "string", // The question text. Length: 10 to 400 characters.
  "difficulty": "string", // Must be either "medium" or "hard".
  "category": "string", // Must be the exact Exam Category Label from the INPUT DATA.
  "tags": ["string"], // 3 to 8 relevant, lowercase, hyphen-separated tags.
  "context": "string", // Background information, 10 to 300 characters.
  "estimatedTime": number, // Integer between 1 and 60 (minutes).
  "options": [
    {
      "name": "string", // Option text, 1 to 20 words.
      "isCorrect": boolean // true for exactly one option, false for others.
    }
  ], // Must be exactly 4 options.
  "previousYearQuestion": "string", // If applicable, format: "exam_name-year", else "".
  "correctAnswer": number, // 0-based index of the correct option. Must match option with isCorrect: true.
  "explanation": "string", // 20–50 words explaining why the correct option is right and others are wrong.
  "metadata": {
    "source": "ai-generated",
    "complexity": number, // Integer 5–10. "medium" → 5–7, "hard" → 8–10.
    "bloomsLevel": "string", // One of: "apply", "analyze", "evaluate", "create".
    "learningObjective": "string" // Brief learning objective, may be "" if not required.
  }
}

3. Do not include markdown formatting, comments, or any text outside the JSON.  
4. Ensure 'correctAnswer' index always matches the option with '"isCorrect": true'.  
5. Ensure 'tags' are lowercase, concise, hyphen-separated.  
6. Ensure 'explanation' length is strictly 20 to 50 words.  

---

### INPUT DATA:
Category: ${category}  
Language: ${language}  
Study Material:  
${content}

---

### OUTPUT:
Return an array of  MCQs in strict JSON format, each following the schema above.
`;
}
