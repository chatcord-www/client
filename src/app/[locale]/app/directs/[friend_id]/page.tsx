import { DirectMessageView } from "../_components/direct-message-view";
import { redirect } from "@/navigation";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { friendships, users } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export default async function DirectFriendPage(props: {
  params: { friend_id: string };
}) {
  const session = await getServerAuthSession();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/");
  }

  const resolvedUserId = userId as string;

  const friend = await db
    .select({
      id: users.id,
      name: users.name,
      image: users.image,
      discriminator: users.discriminator,
      activity: users.activity,
    })
    .from(friendships)
    .innerJoin(users, eq(users.id, friendships.friendId))
    .where(
      and(
        eq(friendships.userId, resolvedUserId),
        eq(users.id, props.params.friend_id),
      ),
    )
    .limit(1);

  if (!friend[0]?.id) {
    redirect("/app/directs");
  }

  const friendInfo = friend[0]!;

  return <DirectMessageView friend={friendInfo} />;
}
