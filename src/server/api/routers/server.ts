import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { channels, servers, usersToServers } from "@/server/db/schema";
import { eq } from "drizzle-orm";
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
            },
          },
        },
      });

      return members.map((m) => m.user);
    }),
});
