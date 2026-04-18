import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { channels, servers, users, usersToServers } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const serverRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3),
        public: z.boolean().default(false),
        icon: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const serverId = crypto.randomUUID();

      await ctx.db.insert(servers).values({
        id: serverId,
        name: input.name,
        public: input.public,
        icon: input.icon ?? null,
        ownerId: ctx.session.user.id,
      });

      // Create a default "general" text channel
      await ctx.db.insert(channels).values({
        name: "general",
        serverId,
        type: "TEXT",
      });

      // Add owner as a member
      await ctx.db.insert(usersToServers).values({
        userId: ctx.session.user.id,
        serverId,
      });

      return {
        id: serverId,
        name: input.name,
        icon: input.icon ?? null,
        public: input.public,
        ownerId: ctx.session.user.id,
      };
    }),

  getMembers: protectedProcedure
    .input(z.object({ serverId: z.string() }))
    .query(async ({ input, ctx }) => {
      const members = await ctx.db.query.usersToServers.findMany({
        where: eq(usersToServers.serverId, input.serverId),
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              image: true,
              activity: true,
              discriminator: true,
              bannerColor: true,
            },
          },
        },
      });

      return members.map((m) => m.user);
    }),

  getPublicServers: protectedProcedure.query(async ({ ctx }) => {
    const publicServers = await ctx.db.query.servers.findMany({
      where: eq(servers.public, true),
      with: {
        owner: {
          columns: { id: true, name: true, image: true },
        },
        members: true,
      },
    });

    return publicServers.map((s) => ({
      id: s.id,
      name: s.name,
      icon: s.icon,
      ownerId: s.ownerId,
      ownerName: s.owner.name,
      memberCount: s.members.length,
      isMember: s.members.some((m) => m.userId === ctx.session.user.id),
    }));
  }),

  join: protectedProcedure
    .input(z.object({ serverId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const server = await ctx.db.query.servers.findFirst({
        where: and(
          eq(servers.id, input.serverId),
          eq(servers.public, true),
        ),
      });

      if (!server) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Server not found or is not public",
        });
      }

      const existing = await ctx.db.query.usersToServers.findFirst({
        where: and(
          eq(usersToServers.userId, ctx.session.user.id),
          eq(usersToServers.serverId, input.serverId),
        ),
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Already a member of this server",
        });
      }

      await ctx.db.insert(usersToServers).values({
        userId: ctx.session.user.id,
        serverId: input.serverId,
      });

      return { serverId: server.id, name: server.name };
    }),
});
