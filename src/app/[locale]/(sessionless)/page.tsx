import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";

export default async function Home() {
  const t = await getTranslations("landing");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="relative z-10">
        <div className="mx-auto max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-block bg-gradient-to-l from-green-400 to-green-700 bg-clip-text text-sm font-medium text-transparent dark:from-emerald-500 dark:to-emerald-400">
              {t("preline-p", { date: new Date().getFullYear() })}
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
              <Link href="/login">
                <Button size="lg">{t("get-started-btn")}</Button>
              </Link>
              <Button variant={"link"}>{t("continue-with-dc")}</Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
