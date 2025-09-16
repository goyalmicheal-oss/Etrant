"use server";

import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { InterestCategory } from "@/types";
import { eq } from "drizzle-orm";

export const setInterests = async (
  userEmail: string,
  interests?: InterestCategory,
  language?: string,
) => {
  if (!interests && !language) {
    return { success: false, error: "Field is required" };
  }

  try {
    if (interests && !language) {
      await db
        .update(users)
        .set({ interest: interests })
        .where(eq(users.email, userEmail));
    } else if (language && !interests) {
      await db
        .update(users)
        .set({ language })
        .where(eq(users.email, userEmail));
    } else if (interests && language) {
      await db
        .update(users)
        .set({ interest: interests, language })
        .where(eq(users.email, userEmail));
    }
    return { success: true, message: "Data stored successfully" };
  } catch (error) {
    return { success: false, error: "Failed to store interest" };
  }
};
