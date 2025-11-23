import { db } from "@/lib/db/db";
import { digestService } from "@/lib/repositories/daily-digest-repository";
import { NextRequest, NextResponse } from "next/server";
import { dailyDigest } from "@/lib/db/schema";
import { getTodayDate } from "@/lib/utils";
import { createErrorResponse } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    // Verify CRON secret for security
    const authHeader = request.headers.get("authorization");
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

    if (!process.env.CRON_SECRET) {
      console.error("CRON_SECRET not configured");
      return createErrorResponse("Server misconfiguration", 500);
    }

    if (authHeader !== expectedAuth) {
      console.warn("Unauthorized daily digest request attempt");
      return createErrorResponse("Unauthorized", 401);
    }

    // Generate daily digest
    const articles = await digestService.generateDailyDigest();

    if (!Array.isArray(articles)) {
      console.error("Invalid response from digest service");
      return NextResponse.json({
        success: false,
        data: null,
        error: "Failed to generate digest",
      });
    }

    // Filter and insert relevant articles
    const relevantArticles = articles.filter(article => article.is_relevant);

    if (relevantArticles.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "No relevant articles found for today",
      });
    }

    // Insert articles into database
    const insertedArticles = [];
    for (const article of relevantArticles) {
      try {
        const [inserted] = await db
          .insert(dailyDigest)
          .values({
            title: article.title,
            isRelevant: article.is_relevant,
            summary: article.summary,
            sourceUrl: article.source_url,
            topic: article.topic,
            relevantQuestions: article.relevant_questions,
            date: getTodayDate(),
          })
          .returning();

        insertedArticles.push(inserted);
      } catch (error) {
        console.error("Error inserting article:", article.title, error);
        // Continue with other articles even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      data: insertedArticles,
      count: insertedArticles.length,
    });
  } catch (error) {
    console.error("Daily Digest API Error:", error);

    return createErrorResponse(
      "Internal Server Error",
      500,
      process.env.NODE_ENV === "development"
        ? { message: error instanceof Error ? error.message : "Unknown error" }
        : undefined
    );
  }
}

