import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";

import { env } from "@/env";
import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export type USER_STATUS_ENUM = "ONLINE" | "IDLE" | "DND" | "OFFLINE";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      discriminator: string;
      activity: USER_STATUS_ENUM;
      status: { emoji: string; title: string };
      aboutMe: string;
      createdAt: Date
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  events: {
    createUser: async ({ user }) => {
      let discriminator;
      let existingUser;

      do {
        discriminator = Math.floor(1000 + Math.random() * 9000).toString();
        existingUser = await db.query.users.findFirst({
          columns: { id: true },
          where: and(
            eq(users.name, user.name!),
            eq(users.discriminator, discriminator),
          ),
        });
      } while (existingUser);

      await db
        .update(users)
        .set({ discriminator })
        .where(eq(users.id, user.id));
    },
  },
  callbacks: {
    session: async ({ session, user }) => {
      const profilePreferences = await db.query.users.findFirst({
        columns: { id: true, status: true, activity: true, aboutMe: true, createdAt: true },
        where: eq(users.id, user.id),
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          activity: profilePreferences?.activity,
          status: profilePreferences?.status,
          aboutMe: profilePreferences?.aboutMe,
          createdAt: profilePreferences?.createdAt
        },
      };
    },
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
