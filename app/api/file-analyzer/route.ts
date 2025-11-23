export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { AIQuestions } from "@/lib/repositories/question-repository";
import { InterestCategory } from "@/types";
import PDFParser from "pdf2json";
import mammoth from "mammoth";
import fileToQuestionsPrompt from "@/lib/prompts/file-to-questions";
import { files, mcqs } from "@/lib/db/schema";
import { db } from "@/lib/db/db";
import { rateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import {
  validateFile,
  sanitizeFilename,
  createErrorResponse,
  fileUploadConfigs,
} from "@/lib/validation";
import { auth } from "@/auth";

const fileUploadRateLimit = rateLimit(rateLimitConfigs.fileUpload);

export async function POST(req: NextRequest) {
  try {
    // Authentication check
    const session = await auth();
    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized", 401);
    }

    // Rate limiting
    const rateLimitResponse = fileUploadRateLimit(session.user.id);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const formData = await req.formData();
    const category = formData.get("category") as InterestCategory | null;
    const language = formData.get("language") as string | null;
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string | null;
    const fileName = formData.get("fileName") as string | null;

    // Validate required fields
    if (!category || !language || !file || !userId || !fileName) {
      return createErrorResponse(
        "Missing required fields: category, language, file, userId, or fileName"
      );
    }

    // Verify user owns this request
    if (userId !== session.user.id) {
      return createErrorResponse("Forbidden: User ID mismatch", 403);
    }

    // Validate file
    const fileValidation = validateFile(file, fileUploadConfigs.document);
    if (!fileValidation.valid) {
      return createErrorResponse(fileValidation.error || "Invalid file");
    }

    // Sanitize filename
    const sanitizedFileName = sanitizeFilename(fileName);

    // Extract text content
    const textContent = await extractFileText(file);

    if (!textContent || textContent.trim().length === 0) {
      return createErrorResponse("Could not extract text from file. Please ensure the file contains readable text.");
    }

    // Generate questions
    const prompt = fileToQuestionsPrompt(category, language, textContent);
    const questions = await AIQuestions.getAIQuestions(prompt);

    if (questions.length > 0) {
      const [newFile] = await db
        .insert(files)
        .values({
          userId: userId,
          fileName: sanitizedFileName,
          uploadedAt: new Date(),
        })
        .returning();

      await db.insert(mcqs).values(
        questions.map((mcq) => ({
          fileId: newFile.id,
          question: mcq.question,
          difficulty: mcq.difficulty,
          category: mcq.category,
          tags: mcq.tags,
          context: mcq.context,
          estimatedTime: mcq.estimatedTime,
          options: mcq.options,
          previousYearQuestion: mcq.previousYearQuestion,
          correctAnswer: mcq.correctAnswer,
          explanation: mcq.explanation ?? "",
          metadata: mcq.metadata,
        }))
      );
    }

    return NextResponse.json(
      { success: true, questions: questions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/file-analyzer:", error);

    // Don't leak internal error details to client
    return createErrorResponse(
      "Failed to process file. Please try again later.",
      500
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
