import { db } from "@/lib/db/db";
import { digestService } from "@/lib/repositories/daily-digest-repository";
import { NextRequest, NextResponse } from "next/server";
import { dailyDigest } from "@/lib/db/schema";
import { getTodayDate } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }
    const articles = await digestService.generateDailyDigest();
    for (const article of articles) {
      if (!article.is_relevant) return;
      await db
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
    }
    return NextResponse.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
