import { InterestCategory } from "@/types";
import { INTERESTS } from "@/data/interest";

export function generateQuestionPrompt(interest: InterestCategory) {
  const interestObj = INTERESTS.find((int) => int.id === interest);
  if (!interestObj) {
    throw new Error(`Invalid interest category: ${interest}`);
  }
  return `
## SYSTEM INSTRUCTIONS
You are a specialized JSON generation API. Your sole purpose is to create educational exam questions and return them in a valid, raw JSON format. You MUST adhere strictly to the output specifications. Do not provide any conversational text, introductions, or summaries. Your entire response must be a single, valid JSON array.

---
## CORE TASK
Generate 10 practice questions for the exam specified in the INPUT DATA section. The questions should be really hard in difficulty.

---
## INPUT DATA
- **Exam Category Label**: ${interestObj.label}
- **Exam Description**: ${interestObj.brief}

---
## OUTPUT SPECIFICATION

### 1. Top-Level Structure
- The entire output MUST be a single JSON array "[...]".
- The array MUST contain exactly 10 JSON objects.
- The response MUST start with "[" and end with "]". There must be NO other text or formatting outside of this JSON array.
- **CRITICAL:** DO NOT wrap the output in markdown code blocks.

### 2. JSON Object Schema (Per Question)
Each object in the array must have the following exact structure and adhere to these constraints:

{
    "question": "string", // The question text. Length: 10 to 400 characters.
    "difficulty": "string", // Must be one of: 'medium', or 'hard'.
    "category": "string", // Must be the exact Exam Category Label provided in the INPUT DATA.
    "tags": ["string"], // An array of 3 to 8 relevant, lowercase, hyphen-separated string tags.
    "context": "string", // Background information for the question. Length: 10 to 300 characters.
    "estimatedTime": "number", // An integer from 1 to 60, representing estimated minutes to solve.
    "options": [ // An array of exactly 4 option objects.
      {
        "name": "string", // The text for this option. // Length: 1 to 20 words
        "isCorrect": "boolean" // true or false.
      }
    ],
    "previousYearQuestion": "string", // Identifier like "exam_name-year". Leave as an empty string "" if not applicable.
    "correctAnswer": "number", // The 0-based index of the correct option in the "options" array. This MUST match the option with "isCorrect": true.
    "explanation": "string", // A detailed explanation for why the correct answer is correct and others are not. Lenght should be strictly 10-50 words.
    "metadata": { // A nested object for metadata.
      "source": "string", // Must be "ai-generated".
      "complexity": "number", // An integer from 5 to 10, representing difficulty on a 1-10 scale ('medium' maps to 5-7, 'hard' to 8-10).
      "bloomsLevel": "string", // Must be one of: 'apply', 'analyze', 'evaluate', 'create'. Avoid 'remember' and 'understand'.
      "learningObjective": "string" // A brief learning objective. Optional, can be an empty string "".
    }
}

### 3. Key Constraints & Validation Rules
- **Options Array:** The "options" array must contain exactly 4 objects.
- **Single Correct Answer:** Within the "options" array, exactly ONE object must have '"isCorrect": true'. The other three must have '"isCorrect": false'.
- **Index Match:** The 'correctAnswer' index must correspond to the option where 'isCorrect' is 'true'.
- **String Escaping:** Ensure all strings within the JSON are properly escaped (e.g., use '\"' for double quotes inside a string).

---
## FINAL CHECKLIST (Internal monologue before responding)
1.  Is my entire response starting with '[' and ending with ']' and nothing else?
2.  Does the array contain exactly 10 objects?
3.  Have I avoided all markdown and conversational text?
4.  Does every object precisely match the specified schema and data types?
5.  In every object, is there exactly one correct option and does the 'correctAnswer' index match it?
6.  Is the generated JSON syntax 100% valid?
7. The correct options should be differennt for each question. Don't always put the correct answer in one option (e.g. option1 or option2 should not be always correct)
8. Most of the questions level should be hard.
9. Try to add as much previous year question as possible of the ${interestObj.label} exam.

Proceed with generation.
`;
}
