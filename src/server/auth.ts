import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";

import { env } from "@/env";
import { generateUniqueDiscriminator } from "@/server/discriminator";
import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { encode } from "next-auth/jwt";

export type USER_STATUS_ENUM = "ONLINE" | "IDLE" | "DND" | "OFFLINE";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      discriminator: string;
      activity: USER_STATUS_ENUM;
      status: { emoji: string; title: string };
      aboutMe: string;
      createdAt: Date;
    } & DefaultSession["user"];
    cookies: string;
  }
}

export const authOptions: NextAuthOptions = {
  events: {
    createUser: async ({ user }) => {
      const discriminator = await generateUniqueDiscriminator(user.name!);

      await db
        .update(users)
        .set({ discriminator })
        .where(eq(users.id, user.id));
    },
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token }) => {
      const cookies = await encode({
        secret: env.NEXTAUTH_SECRET as string,
        token: {
          sub: token.sub,
        },
      });

      if (cookies) {
        token.cookies = cookies;
      }

      return token;
    },
    session: async ({ session, token }) => {
      const profilePreferences = await db.query.users.findFirst({
        columns: {
          id: true,
          status: true,
          activity: true,
          aboutMe: true,
          createdAt: true,
          discriminator: true,
        },
        where: eq(users.id, token.sub as string),
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          activity: profilePreferences?.activity,
          status: profilePreferences?.status,
          aboutMe: profilePreferences?.aboutMe,
          createdAt: profilePreferences?.createdAt,
          discrimantor: profilePreferences?.discriminator,
        },
        cookies: token.cookies,
      };
    },
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users as never,
    accountsTable: accounts as never,
    sessionsTable: sessions as never,
    verificationTokensTable: verificationTokens as never,
  }) as Adapter,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
        });

        if (!user?.password) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
