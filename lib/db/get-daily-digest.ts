import { eq } from "drizzle-orm";
import { db } from "./db";
import { dailyDigest } from "./schema";
import { getTodayDate } from "../utils";

export async function getDailyDigest() {
  try {
    const daily_digest = await db
      .select({
        id: dailyDigest.id,
        title: dailyDigest.title,
        is_relevant: dailyDigest.isRelevant,
        summary: dailyDigest.summary,
        source_url: dailyDigest.sourceUrl,
        topic: dailyDigest.topic,
        date: dailyDigest.date,
      })
      .from(dailyDigest)
      .where(eq(dailyDigest.date, getTodayDate()));
    return daily_digest || [];
  } catch (error) {
    console.error("DailyDigest Error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
