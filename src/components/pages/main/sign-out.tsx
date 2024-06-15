"use client"
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default async function DiscordSignOutButton({
  buttonText,
}: {
  buttonText: string;
}) {
  const handleDiscordSignIn = async () => {
    await signOut();
  };

  return (
    <Button variant={"destructive"} onClick={handleDiscordSignIn}>
      {buttonText}
    </Button>
  );
}
