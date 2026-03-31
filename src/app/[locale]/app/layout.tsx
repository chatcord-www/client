import { Sidebar } from "@/components/pages/global/sidebar";
import { LocalesType } from "@/i18n";
import { redirect } from "@/navigation";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { servers, usersToServers } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { ReactNode } from "react";

export default async function AppLayout({
  children,
  ...props
}: {
  children: ReactNode;
  params: { locale: LocalesType };
}) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/");
  }
  
  const joinedServers = await db.query.usersToServers.findMany({
    where: eq(usersToServers.userId, session?.user.id as string),
    with: {
      server: true,
    },
  });

  const serversList = joinedServers.map((entry) => entry.server);


  return (
    <main className="flex w-full">
      <Sidebar locale={props.params.locale} servers={serversList} />
      <div className="w-full px-4 py-2">{children}</div>
    </main>
  );
}
