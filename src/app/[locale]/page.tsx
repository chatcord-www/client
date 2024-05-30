import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import { LangChanger } from "./_components/lang-changer";

export default async function Home() {
  const t = await getTranslations("landing")

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-96 start-1/2 flex -translate-x-1/2 transform"
        >
          <div className="h-[44rem] w-[25rem] -translate-x-[10rem] rotate-[-60deg] transform bg-gradient-to-r from-violet-300/50 to-purple-100 blur-3xl dark:from-violet-900/50 dark:to-purple-900"></div>
          <div className="rounded-fulls h-[50rem] w-[90rem] origin-top-left -translate-x-[15rem] -rotate-12 bg-gradient-to-tl from-blue-50 via-blue-100 to-blue-50 blur-3xl dark:from-indigo-900/70 dark:via-indigo-900/70 dark:to-blue-900/70"></div>
        </div>
        <div className="relative z-10">
          <div className="mx-auto max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <p className="inline-block bg-gradient-to-l from-blue-600 to-violet-500 bg-clip-text text-sm font-medium text-transparent dark:from-blue-400 dark:to-violet-400">
                {t("preline-p")}
              </p>
              <div className="mt-5 max-w-2xl">
                <h1 className="block text-4xl font-semibold text-gray-800 dark:text-neutral-200 md:text-5xl lg:text-6xl">
                {t("title")}
                </h1>
              </div>

              <div className="mt-5 max-w-3xl">
                <p className="text-lg text-gray-600 dark:text-neutral-400">
                  {t("description")}
                </p>
              </div>

              <div className="mt-8 flex justify-center gap-3">
                <a
                  className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
                  href="#"
                >
                  {t("get-started-btn")}
                  <svg
                    className="size-4 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </a>
                <Link
                  className="inline-flex items-center gap-x-2 rounded-lg border border-transparent px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-800"
                  href="#"
                >
                  {t("continue-with-dc")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    <LangChanger />
    </main>
  );
}
