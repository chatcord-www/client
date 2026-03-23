import { VerifyEmailForm } from "@/components/pages/verify-email/form";
import { getTranslations } from "next-intl/server";

export default async function VerifyEmailPage() {
  const t = await getTranslations("verify-email");

  return (
    <main className="z-10 flex min-h-screen w-full flex-col items-center justify-center">
      <div className="w-full max-w-lg">
        <div>
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm sm:text-base">{t("subtitle")}</p>
        </div>
        <VerifyEmailForm />
      </div>
    </main>
  );
}
