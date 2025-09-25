import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import type { UserField } from "@/app/lib/definitions";
import bcrypt from "bcrypt";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function getUser(email: string): Promise<UserField | undefined> {
  try {
    const user = await sql<UserField[]>`SELECT * FROM wig_users WHERE email=${email}`;
    console.log("User:", user);
    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  // ADD THESE CALLBACKS:
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Persist the user ID to the token right after sign-in
      if (user) {
        token.id = user.id; // This adds the ID to the JWT token
      }
      return token;
    },
    async session({ session, token }) {
      // Send the user ID to the client session
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt', // Ensure JWT strategy is used
  },
});