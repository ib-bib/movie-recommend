import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import EmailProvider from "next-auth/providers/nodemailer";
import { env } from "~/env";

import { db } from "~/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "~/server/db/schema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  theme: {
    colorScheme: "dark",
    brandColor: "#002088",
    logo: "/logo-full.png",
  },
  providers: [
    EmailProvider({
      server: {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: env.MAIL_USER,
          pass: env.MAIL_PASS,
        },
      },
      from: env.MAIL_USER,
      name: "Email",
    }),
  ],
  events: {
    async createUser({ user }) {
      const email = user.email;
      const userId = user.id;

      if (!email || !userId) return;

      // Use the email prefix as a default name
      const defaultName = email.split("@")[0];

      await db
        .update(users)
        .set({ name: defaultName }) // assumes you have a `name` column
        .where(eq(users.id, userId));
    },
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    async redirect({ baseUrl }) {
      // After login, always redirect to /profile
      return `${baseUrl}/profile`;
    },
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
} satisfies NextAuthConfig;
