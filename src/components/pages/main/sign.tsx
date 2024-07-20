"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

export function DiscordSignInButton() {
  const t = useTranslations("landing");

  return (
    <Button variant={"link"} onClick={() => signIn("discord")}>
      {t("continue-with-dc")}
    </Button>
  );
}
