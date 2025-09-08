import { auth } from "@/auth";
import { IUser } from "@/types";

export const getUserData = async () => {
  try {
    const session = await auth();
    const res = await fetch(`${process.env.NEXT_BASE_URL}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: session?.user?.id }),
    });
    const user = await res.json();
    console.log("res", user);

    if (user) {
      return user as IUser;
    }
    return null;
  } catch (error) {
    console.log("Unexpected error occured.");
    return null;
  }
};
