import { DirectSidebar } from "./_components/direct-sidebar";

export default function DirectLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <main className="flex min-h-[calc(100vh-1.25rem)] w-full gap-3 py-2">
      <DirectSidebar />
      {children}
    </main>
  );
}