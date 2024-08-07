import { redirect } from "@/navigation";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";

export default async function ServerPage(props: {
  params: { server_id: string };
}) {
  const firstChannel = await db.query.channels.findFirst({
    where: (channels) => eq(channels.serverId, props.params.server_id),
  });

  redirect(`/app/servers/${props.params.server_id}/${firstChannel?.id}`);

  return null;
}
