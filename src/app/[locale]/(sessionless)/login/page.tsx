import { LoginForm } from "@/components/pages/login/form";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";

export default async function LoginPage() {
  const t = await getTranslations("login");

  return (
    <main className="z-10 flex min-h-screen w-full flex-col items-center justify-center">
      <div className="w-full max-w-lg">
        <div>
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="sm:text-base text-sm">{t("subtitle")}</p>
        </div>
        <LoginForm />
        <div className="mt-6 flex w-full items-center justify-center">
          <Link
            href="/sign-up"
            className="sm:text-sm text-xs text-primary hover:underline"
          >
            {t("signup")}
          </Link>
        </div>
      </div>
    </main>
  );
}
