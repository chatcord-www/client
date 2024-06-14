import { ReactNode } from "react";
import { Sidebar } from "@/components/pages/global/sidebar";
import { redirect } from "@/navigation";
import { getServerAuthSession } from "@/server/auth";
import { LocalesType } from "@/i18n";

export default async function AppLayout({
  children,
  ...props
}: {
  children: ReactNode;
  params: { locale: LocalesType };
}) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }
  return (
    <main className="flex w-full">
      <Sidebar locale={props.params.locale} />
      <div className="w-full px-4 py-2">{children}</div>
    </main>
  );
}
