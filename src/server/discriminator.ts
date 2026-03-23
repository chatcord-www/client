import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const generateUniqueDiscriminator = async (name: string) => {
  let discriminator: string;
  let collision: { id: string } | undefined;

  do {
    discriminator = Math.floor(1000 + Math.random() * 9000).toString();
    collision = await db.query.users.findFirst({
      columns: { id: true },
      where: and(eq(users.name, name), eq(users.discriminator, discriminator)),
    });
  } while (collision);

  return discriminator;
};
