import "server-only";
import { auth } from "@/auth";
import { IUser } from "@/types";
import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const getUserData = async () => {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id));

    if (user && user.length > 0) {
      return user[0] as IUser;
    }
    return null;
  } catch (error) {
    console.log("Unexpected error occured.", error);
    return null;
  }
};
