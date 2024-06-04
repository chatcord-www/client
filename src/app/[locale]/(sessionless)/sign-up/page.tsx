import { SingupForm } from "@/components/pages/signup/form";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";

export default async function SignUpPage() {
  const t = await getTranslations("signup");

  return (
    <main className="z-10 flex min-h-screen w-full flex-col items-center justify-center">
      <div className="w-full max-w-lg">
        <div>
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="sm:text-base text-sm">{t("subtitle")}</p>
        </div>
        <SingupForm />
        <div className="mt-6 flex w-full items-center justify-center">
          <Link
            href="/login"
            className="sm:text-sm text-xs text-primary hover:underline"
          >
            {t("login")}
          </Link>
        </div>
      </div>
    </main>
  );
}
