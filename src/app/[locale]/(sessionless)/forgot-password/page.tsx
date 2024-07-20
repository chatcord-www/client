import { RecoverPasswordForm } from "@/components/pages/recover-password/form";
import { getTranslations } from "next-intl/server";

export default async function ForgotPasswordPage() {
  const t = await getTranslations("recover");

  return (
    <main className="z-10 flex min-h-screen w-full flex-col items-center justify-center">
      <div className="w-full max-w-lg">
        <div>
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="sm:text-base text-sm">{t("subtitle")}</p>
        </div>
        <RecoverPasswordForm />
      </div>
    </main>
  );
}
