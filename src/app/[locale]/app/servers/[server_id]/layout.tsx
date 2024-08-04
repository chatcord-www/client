import { redirect } from "@/navigation";
import { db } from "@/server/db";
import { servers } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { Sidebar } from "./_components/sidebar";

type Props = { params: { server_id: string } };

export default async function ChannelsLayout({
  children,
  params,
}: React.PropsWithChildren<Props>) {
  const server = await db.query.servers.findFirst({
    where: eq(servers.id, params.server_id),
    with: {
      categories: true,
    },
  });

  if (!server) {
    return redirect("/404");
  }

  return (
    <main className="flex items-center">
      <Sidebar
        name={server.name as string}
        serverId={server.id}
        categories={server.categories}
      />
      {children}
    </main>
  );
}
