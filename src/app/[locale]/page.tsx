import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute -top-96 start-1/2 flex -translate-x-1/2 transform">
        <div className="h-[44rem] w-[25rem] -translate-x-[10rem] rotate-[-60deg] transform bg-gradient-to-r from-violet-300/50 to-purple-100 blur-3xl dark:from-green-900/50 dark:to-green-900" />
        <div className="rounded-fulls h-[50rem] w-[90rem] origin-top-left -translate-x-[15rem] -rotate-12 bg-gradient-to-tl from-blue-50 via-blue-100 to-blue-50 blur-3xl dark:from-green-900/70 dark:via-emerald-900/70 dark:to-green-900/70" />
      </div>
      <div className="relative z-10">
        <div className="mx-auto max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-block bg-gradient-to-l from-green-400 to-green-700 bg-clip-text text-sm font-medium text-transparent dark:from-emerald-500 dark:to-emerald-400">
              Preline: A vision for 2024
            </p>
            <div className="mt-5 max-w-2xl">
              <h1 className="block text-4xl font-semibold text-gray-800 dark:text-neutral-200 md:text-5xl lg:text-6xl">
                Web Chatting Aplication
              </h1>
            </div>

            <div className="mt-5 max-w-3xl">
              <p className="text-lg text-gray-600 dark:text-neutral-400">
                Our chatting application is built with Drizzle ORM, Next.js,
                Tailwind CSS, and ShadCN UI, providing a seamless communication
                experience with a modern interface and efficient performance.
              </p>
            </div>
            <div className="mt-3 flex justify-center gap-3">
              <Button size="lg">Get started</Button>
              <Button size="lg" variant="link">
                Continue with discord
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
