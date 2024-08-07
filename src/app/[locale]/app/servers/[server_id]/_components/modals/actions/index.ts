"use server";

import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { categories, channels, servers } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const createCategory = async (e: FormData, serverId: string) => {
  const session = await getServerAuthSession();
  const name = e.get("name") as string;

  const server = await db.query.servers.findFirst({
    where: eq(servers.id, serverId),
  });

  if (server?.ownerId !== session?.user.id)
    return {
      success: false,
      message: "You are not owner",
    };

  await db.insert(categories).values({
    name,
    serverId,
  });

  return {
    success: true,
  };
};

export const createChannel = async (
  e: FormData,
  serverId: string,
  categoryId?: string,
) => {
  try {
    const name = e.get("name") as string;
    const type = e.get("type") as "TEXT" | "VOICE";

    await db.insert(channels).values({
      categoryId: categoryId || null,
      serverId,
      name,
      type,
    });

    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
    };
  }
};
