"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default async function DiscordSignInButton({
  buttonText,
}: {
  buttonText: string;
}) {
  const handleDiscordSignIn = async () => {
    await signIn("discord");
  };

  return (
    <Button variant={"link"} onClick={handleDiscordSignIn}>
      {buttonText}
    </Button>
  );
}
