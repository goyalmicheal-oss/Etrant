import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./lib/db/db";
import { accounts, sessions, users, verificationTokens } from "./lib/db/schema";

export const authOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // authorization: {
      //   params: {
      //     scope:
      //       "openid email profile https://www.googleapis.com/auth/calendar.events",
      //   },
      // },
    }),
  ],
  events: {
    async signIn({ user, isNewUser }: any) {
      if (isNewUser && user.email) {
        await fetch(`${process.env.NEXT_BASE_URL}/api/send-mail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
          }),
        });
      }
    },
  },
};
export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
