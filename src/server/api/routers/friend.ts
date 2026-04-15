import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { friendRequests, friendships, users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, or } from "drizzle-orm";
import { z } from "zod";

const targetSchema = z.object({
  targetUserId: z.string().min(1),
});

export const friendRouter = createTRPCRouter({
  listFriends: protectedProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.session.user.id;

    const rows = await ctx.db
      .select({
        friendId: users.id,
        friendName: users.name,
        friendImage: users.image,
        friendDiscriminator: users.discriminator,
        friendActivity: users.activity,
      })
      .from(friendships)
      .innerJoin(users, eq(users.id, friendships.friendId))
      .where(eq(friendships.userId, currentUserId))
      .orderBy(asc(users.name));

    return rows.map((row) => ({
      id: row.friendId,
      name: row.friendName,
      image: row.friendImage,
      discriminator: row.friendDiscriminator,
      activity: row.friendActivity,
    }));
  }),

  listIncomingRequests: protectedProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.session.user.id;

    const rows = await ctx.db
      .select({
        requestId: friendRequests.id,
        createdAt: friendRequests.createdAt,
        senderId: users.id,
        senderName: users.name,
        senderImage: users.image,
        senderDiscriminator: users.discriminator,
        senderActivity: users.activity,
      })
      .from(friendRequests)
      .innerJoin(users, eq(users.id, friendRequests.senderId))
      .where(
        and(
          eq(friendRequests.receiverId, currentUserId),
          eq(friendRequests.status, "PENDING"),
        ),
      )
      .orderBy(desc(friendRequests.createdAt));

    return rows.map((row) => ({
      id: row.requestId,
      createdAt: row.createdAt,
      sender: {
        id: row.senderId,
        name: row.senderName,
        image: row.senderImage,
        discriminator: row.senderDiscriminator,
        activity: row.senderActivity,
      },
    }));
  }),

  listOutgoingRequests: protectedProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.session.user.id;

    const rows = await ctx.db
      .select({
        requestId: friendRequests.id,
        createdAt: friendRequests.createdAt,
        receiverId: users.id,
        receiverName: users.name,
        receiverImage: users.image,
        receiverDiscriminator: users.discriminator,
        receiverActivity: users.activity,
      })
      .from(friendRequests)
      .innerJoin(users, eq(users.id, friendRequests.receiverId))
      .where(
        and(
          eq(friendRequests.senderId, currentUserId),
          eq(friendRequests.status, "PENDING"),
        ),
      )
      .orderBy(desc(friendRequests.createdAt));

    return rows.map((row) => ({
      id: row.requestId,
      createdAt: row.createdAt,
      receiver: {
        id: row.receiverId,
        name: row.receiverName,
        image: row.receiverImage,
        discriminator: row.receiverDiscriminator,
        activity: row.receiverActivity,
      },
    }));
  }),

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

  declineFriendRequest: protectedProcedure
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

      await ctx.db
        .update(friendRequests)
        .set({ status: "DECLINED", updatedAt: new Date() })
        .where(eq(friendRequests.id, incoming.id));

      return { success: true };
    }),

  cancelFriendRequest: protectedProcedure
    .input(targetSchema)
    .mutation(async ({ input, ctx }) => {
      const currentUserId = ctx.session.user.id;

      const outgoing = await ctx.db.query.friendRequests.findFirst({
        where: and(
          eq(friendRequests.senderId, currentUserId),
          eq(friendRequests.receiverId, input.targetUserId),
          eq(friendRequests.status, "PENDING"),
        ),
      });

      if (!outgoing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Friend request not found",
        });
      }

      await ctx.db
        .update(friendRequests)
        .set({ status: "DECLINED", updatedAt: new Date() })
        .where(eq(friendRequests.id, outgoing.id));

      return { success: true };
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