import { DirectsSidebar } from "./_components/directs-sidebar";

export default function DirectsLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <main className="flex min-h-[calc(100vh-1.25rem)] w-full gap-3 py-2">
      <DirectsSidebar />
      {children}
    </main>
  );
}