import { redirect } from "@/navigation";
import { db } from "@/server/db";
import { servers } from "@/server/db/schema";
import { eq, isNull } from "drizzle-orm";
import { Sidebar } from "./_components/sidebar";

type Props = { params: { server_id: string } };

export default async function ChannelsLayout({
  children,
  params,
}: React.PropsWithChildren<Props>) {
  const server = await db.query.servers.findFirst({
    where: eq(servers.id, params.server_id),
    with: {
      categories: { with: { channels: true } },
    },
  });

  
  if (!server) {
    return redirect("/404");
  }

  const channelsWithoutCategories = await db.query.channels.findMany({
    where: (channels, { and }) =>
      and(eq(channels.serverId, params.server_id), isNull(channels.categoryId)),
  });

  return (
    <main className="flex items-center">
      <Sidebar
        channelsWithoutCategory={channelsWithoutCategories}
        name={server.name as string}
        serverId={server.id}
        categories={server.categories}
      />
      {children}
    </main>
  );
}
