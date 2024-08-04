"use server";

import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { categories, servers } from "@/server/db/schema";
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

// export const createChannel = async (
//   e: FormData,
//   serverId: string,
//   categoryId?: string,
// ) => {};
