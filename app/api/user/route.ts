import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { IUser } from "@/types";
import { auth } from "@/auth";
import { rateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import { createErrorResponse } from "@/lib/validation";

const apiRateLimit = rateLimit(rateLimitConfigs.api);

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized", 401);
    }

    const userResult = await db.select().from(users).where(eq(users.id, session.user.id));
    const user = userResult[0];

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return createErrorResponse("Internal Server Error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth();
    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized", 401);
    }

    // Rate limiting
    const rateLimitResponse = apiRateLimit(session.user.id);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { userId } = await request.json();

    if (!userId) {
      return createErrorResponse("Missing userId parameter");
    }

    // Verify user can only access their own data
    if (userId !== session.user.id) {
      return createErrorResponse("Forbidden: Cannot access other user's data", 403);
    }

    const user = await db.select().from(users).where(eq(users.id, userId));

    if (!user || user.length === 0) {
      return createErrorResponse("User not found", 404);
    }

    return NextResponse.json(user[0] as IUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    return createErrorResponse("Internal Server Error", 500);
  }
}

