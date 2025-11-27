import { desc, eq, sql } from "drizzle-orm";
import { cache } from "react";
import { db } from "./db";
import { dailyDigest } from "./schema";

export const getDailyDigest = cache(async () => {
  try {
    // First, get the latest date
    const latestDateResult = await db
      .select({ maxDate: sql<string>`MAX(${dailyDigest.date})` })
      .from(dailyDigest)
      .limit(1);

    const latestDate = latestDateResult[0]?.maxDate;

    // If no date found, return empty array
    if (!latestDate) {
      return [];
    }

    // Get all entries with the latest date
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
      .where(eq(dailyDigest.date, latestDate))
      .orderBy(desc(dailyDigest.id));

    return daily_digest || [];
  } catch (error) {
    console.error("DailyDigest Error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
});
