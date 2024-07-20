import { Sidebar } from "@/components/pages/global/sidebar";
import { LocalesType } from "@/i18n";
import { redirect } from "@/navigation";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { servers } from "@/server/db/schema";
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
  const serversList = await db.query.servers.findMany({
    where: eq(servers.ownerId, session?.user.id as string),
  });

  if (!session) {
    redirect("/");
  }
  return (
    <main className="flex w-full">
      <Sidebar locale={props.params.locale} servers={serversList} />
      <div className="w-full px-4 py-2">{children}</div>
    </main>
  );
}
