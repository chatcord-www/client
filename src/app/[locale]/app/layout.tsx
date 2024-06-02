import { PropsWithChildren } from "react";
import { Sidebar } from "@/components/pages/global/sidebar";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex w-full">
      <Sidebar />
      <div className="w-full px-4 py-2">{children}</div>
    </main>
  );
}
