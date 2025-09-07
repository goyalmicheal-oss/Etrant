"use server";

import { db } from "@/lib/db/db";
import { dailyDigest } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function getSingleDigest(id: string) {
  const digest = await db
    .select()
    .from(dailyDigest)
    .where(eq(dailyDigest.id, Number(id)));
  if (digest) {
    return digest[0];
  }
  return null;
}
