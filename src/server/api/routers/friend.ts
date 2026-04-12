import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { friendRequests, friendships, users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq, or } from "drizzle-orm";
import { z } from "zod";

const targetSchema = z.object({
  targetUserId: z.string().min(1),
});

export const friendRouter = createTRPCRouter({
  getRelationship: protectedProcedure
    .input(targetSchema)
    .query(async ({ input, ctx }) => {
      const currentUserId = ctx.session.user.id;

      if (input.targetUserId === currentUserId) {
        return { status: "SELF" as const };
      }

      const friendship = await ctx.db.query.friendships.findFirst({
        where: and(
          eq(friendships.userId, currentUserId),
          eq(friendships.friendId, input.targetUserId),
        ),
      });

      if (friendship) {
        return { status: "FRIEND" as const };
      }

      const incoming = await ctx.db.query.friendRequests.findFirst({
        where: and(
          eq(friendRequests.senderId, input.targetUserId),
          eq(friendRequests.receiverId, currentUserId),
          eq(friendRequests.status, "PENDING"),
        ),
      });

      if (incoming) {
        return { status: "INCOMING_REQUEST" as const };
      }

      const outgoing = await ctx.db.query.friendRequests.findFirst({
        where: and(
          eq(friendRequests.senderId, currentUserId),
          eq(friendRequests.receiverId, input.targetUserId),
          eq(friendRequests.status, "PENDING"),
        ),
      });

      if (outgoing) {
        return { status: "OUTGOING_REQUEST" as const };
      }

      return { status: "NONE" as const };
    }),

  sendFriendRequest: protectedProcedure
    .input(targetSchema)
    .mutation(async ({ input, ctx }) => {
      const currentUserId = ctx.session.user.id;

      if (input.targetUserId === currentUserId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot send a friend request to yourself",
        });
      }

      const targetUser = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.targetUserId),
      });

      if (!targetUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Target user not found",
        });
      }

      const friendship = await ctx.db.query.friendships.findFirst({
        where: and(
          eq(friendships.userId, currentUserId),
          eq(friendships.friendId, input.targetUserId),
        ),
      });

      if (friendship) {
        return { status: "FRIEND" as const };
      }

      const incoming = await ctx.db.query.friendRequests.findFirst({
        where: and(
          eq(friendRequests.senderId, input.targetUserId),
          eq(friendRequests.receiverId, currentUserId),
          eq(friendRequests.status, "PENDING"),
        ),
      });

      if (incoming) {
        await ctx.db.transaction(async (tx) => {
          await tx
            .update(friendRequests)
            .set({ status: "ACCEPTED", updatedAt: new Date() })
            .where(eq(friendRequests.id, incoming.id));

          await tx
            .insert(friendships)
            .values([
              { userId: currentUserId, friendId: input.targetUserId },
              { userId: input.targetUserId, friendId: currentUserId },
            ])
            .onConflictDoNothing();
        });

        return { status: "FRIEND" as const };
      }

      await ctx.db
        .insert(friendRequests)
        .values({
          senderId: currentUserId,
          receiverId: input.targetUserId,
          status: "PENDING",
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [friendRequests.senderId, friendRequests.receiverId],
          set: {
            status: "PENDING",
            updatedAt: new Date(),
          },
        });

      return { status: "OUTGOING_REQUEST" as const };
    }),

  acceptFriendRequest: protectedProcedure
    .input(z.object({ requesterId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const currentUserId = ctx.session.user.id;

      const incoming = await ctx.db.query.friendRequests.findFirst({
        where: and(
          eq(friendRequests.senderId, input.requesterId),
          eq(friendRequests.receiverId, currentUserId),
          eq(friendRequests.status, "PENDING"),
        ),
      });

      if (!incoming) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Friend request not found",
        });
      }

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(friendRequests)
          .set({ status: "ACCEPTED", updatedAt: new Date() })
          .where(eq(friendRequests.id, incoming.id));

        await tx
          .insert(friendships)
          .values([
            { userId: currentUserId, friendId: input.requesterId },
            { userId: input.requesterId, friendId: currentUserId },
          ])
          .onConflictDoNothing();
      });

      return { status: "FRIEND" as const };
    }),

  removeFriend: protectedProcedure
    .input(targetSchema)
    .mutation(async ({ input, ctx }) => {
      const currentUserId = ctx.session.user.id;

      const targetUser = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.targetUserId),
      });

      if (!targetUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Target user not found",
        });
      }

      await ctx.db.transaction(async (tx) => {
        await tx.delete(friendships).where(
          or(
            and(
              eq(friendships.userId, currentUserId),
              eq(friendships.friendId, input.targetUserId),
            ),
            and(
              eq(friendships.userId, input.targetUserId),
              eq(friendships.friendId, currentUserId),
            ),
          ),
        );

        await tx.delete(friendRequests).where(
          or(
            and(
              eq(friendRequests.senderId, currentUserId),
              eq(friendRequests.receiverId, input.targetUserId),
            ),
            and(
              eq(friendRequests.senderId, input.targetUserId),
              eq(friendRequests.receiverId, currentUserId),
            ),
          ),
        );
      });

      return { success: true };
    }),
});