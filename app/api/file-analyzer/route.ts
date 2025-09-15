export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { AIQuestions } from "@/lib/repositories/question-repository";
import { InterestCategory } from "@/types";
// import pdf from "pdf-parse";
import mammoth from "mammoth";
import fileToQuestionsPrompt from "@/lib/prompts/file-to-questions";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    console.log("form data", formData);
    const category = formData.get("category") as InterestCategory | null;
    const language = formData.get("language") as string | null;
    const file = formData.get("file") as File | null;

    if (!category || !language || !file) {
      return NextResponse.json(
        { error: "Missing required fields: category, language, or file" },
        { status: 400 },
      );
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const textContent = await extractFileText(file);

    const prompt = fileToQuestionsPrompt(category, language, textContent);

    const questions = await AIQuestions.getAIQuestions(prompt);
    console.log("quetsions", questions);
    return NextResponse.json({ success: true, questions }, { status: 200 });
    // return NextResponse.json(
    //   { success: true, questions: buffer },
    //   { status: 200 },
    // );
  } catch (error) {
    console.error("Error in /api/questions:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 },
    );
  }
}

export async function extractFileText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // if (file.type === "application/pdf") {
  //   const pdfData = await pdf(buffer);
  //   return pdfData.text;
  // }
  //
  // if (
  //   file.type ===
  //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
  //   file.name.endsWith(".docx")
  // ) {
  //   const { value } = await mammoth.extractRawText({ buffer });
  //   return value;
  // }

  // if (
  //   file.type.startsWith("text/") ||
  //   file.name.endsWith(".txt") ||
  //   file.name.endsWith(".md")
  // ) {
  //   return buffer.toString("utf-8");
  // }

  // Unsupported type → return empty so we can fallback
  return "";
}
