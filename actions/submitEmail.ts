"use server";

import { db } from "@/lib/db/db";
import { waitlist } from "@/lib/db/schema";
import { z } from "zod";

const emailSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be atleast 5 characters"),
});

const attempts = new Map<string, { count: number; lastAttempt: number }>();
const LIMIT = 3; // max submissions
const WINDOW = 60 * 1000; // 1 minute

function isRateLimited(key: string) {
  const now = Date.now();
  const record = attempts.get(key);

  if (record) {
    if (now - record.lastAttempt < WINDOW) {
      if (record.count >= LIMIT) return true;
      record.count++;
      record.lastAttempt = now;
      attempts.set(key, record);
    } else {
      // reset window
      attempts.set(key, { count: 1, lastAttempt: now });
    }
  } else {
    attempts.set(key, { count: 1, lastAttempt: now });
  }

  return false;
}

export async function submitWaitlistEmail(
  input: { email: string },
  headers?: Headers,
) {
  const parsed = emailSchema.safeParse({ email: input.email });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const email = parsed.data.email.toLowerCase();

  const ip =
    headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(`email:${email}`)) {
    return { error: "Too many attempts for this email. Please wait." };
  }

  if (isRateLimited(`ip:${ip}`)) {
    return { error: "Too many attempts from this IP. Please wait." };
  }

  try {
    await db.insert(waitlist).values({
      email,
      createdAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please Try Again." };
  }
}
