import { PropsWithChildren } from "react";
import { Sidebar } from "@/components/pages/global/sidebar";
import { redirect } from "@/navigation";
import { getServerAuthSession } from "@/server/auth";

export default async function AppLayout({ children }: PropsWithChildren) {
  const session = await getServerAuthSession()
  
  if (!session) {
    redirect("/");
  }
  return (
    <main className="flex w-full">
      <Sidebar />
      <div className="w-full px-4 py-2">{children}</div>
    </main>
  );
}
