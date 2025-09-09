"use server";

import "server-only";
import { cache } from "react";
import { db } from "@/lib/db/db";
import { dailyDigest } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const getSingleDigest = cache(async (id: string) => {
  const digest = await db
    .select()
    .from(dailyDigest)
    .where(eq(dailyDigest.id, Number(id)));

  return digest.length > 0 ? digest[0] : null;
});

export default getSingleDigest;
