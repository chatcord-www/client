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
    <Button onClick={handleDiscordSignIn} className="text-red-500 justify-start hover:text-red-500" variant={'ghost'}>
      {buttonText}
    </Button>
  );
}
