export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { AIQuestions } from "@/lib/repositories/question-repository";
import { InterestCategory } from "@/types";
import PDFParser from "pdf2json";
import mammoth from "mammoth";
import fileToQuestionsPrompt from "@/lib/prompts/file-to-questions";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const category = formData.get("category") as InterestCategory | null;
    const language = formData.get("language") as string | null;
    const file = formData.get("file") as File | null;

    if (!category || !language || !file) {
      return NextResponse.json(
        { error: "Missing required fields: category, language, or file" },
        { status: 400 },
      );
    }
    const textContent = await extractFileText(file);
    const prompt = fileToQuestionsPrompt(category, language, textContent);

    const questions = await AIQuestions.getAIQuestions(prompt);
    return NextResponse.json(
      { success: true, questions: questions },
      { status: 200 },
    );
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

  if (!(buffer instanceof Buffer)) {
    throw new Error("Expected buffer for pdf-parse");
  }
  if (file.type === "application/pdf") {
    return await parsePdf(buffer);
  }

  if (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.endsWith(".docx")
  ) {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }

  if (
    file.type.startsWith("text/") ||
    file.name.endsWith(".txt") ||
    file.name.endsWith(".md")
  ) {
    return buffer.toString("utf-8");
  }

  return "";
}

function parsePdf(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData) => {
      reject(errData);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      // Extract text from all pages
      const texts = pdfData.Pages.map((page: any) =>
        page.Texts.map((t: any) =>
          decodeURIComponent(t.R.map((r: any) => r.T).join("")),
        ).join(" "),
      ).join("\n");

      resolve(texts);
    });

    pdfParser.parseBuffer(buffer);
  });
}
