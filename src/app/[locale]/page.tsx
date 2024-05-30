import { LangChanger } from "./_components/lang-changer";
import { ThemeChanger } from "./_components/theme-changer";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations();

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <div>{t("theme-changer")}</div>
      <ThemeChanger />
      <div className="mt-6">{t("lang-changer")}</div>
      <LangChanger />
    </main>
  );
}
