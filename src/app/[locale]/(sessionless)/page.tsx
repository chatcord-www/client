import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import DiscordSignInButton from '@/components/main/sign'

export default async function Home() {
  const t = await getTranslations("landing");

  return (
    <main className="relative flex min-h-screen items-center justify-center">
      <div className="relative z-10">
        <div className="">
          <div className="mx-auto text-center">
            <p className="inline-block bg-gradient-to-l from-green-400 to-green-700 bg-clip-text text-sm font-medium text-transparent dark:from-emerald-500 dark:to-emerald-400">
              {t("preline-p", { date: new Date().getFullYear() })}
            </p>
            <div className="mt-5">
              <h1 className="block text-4xl font-semibold text-gray-800 dark:text-neutral-200 md:text-5xl lg:text-6xl">
                {t("title")}
              </h1>
            </div>

            <div className="mt-5 max-w-3xl">
              <p className="sm:text-lg text-gray-600 dark:text-neutral-400 text-sm">
                {t("description")}
              </p>
            </div>
            <div className="mt-8 flex justify-center gap-3 flex-col sm:flex-row">
              <Link href="/login">
                <Button size="lg">{t("get-started-btn")}</Button>
              </Link>
              <DiscordSignInButton buttonText={t("continue-with-dc")} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
 