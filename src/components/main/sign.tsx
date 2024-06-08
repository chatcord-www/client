import { Button } from "@/components/ui/button";
import { redirect } from "@/navigation";
import { signIn,signOut, useSession } from "next-auth/react";
import { getServerAuthSession } from "@/server/auth";

export default async  function DiscordSignInButton({ buttonText }: { buttonText: string }) {
  const session = await getServerAuthSession();

   const   handleDiscordSignIn = async () => {
    await signIn('discord')
  };
  const handleLogout = async () => {
    await signOut();
    redirect('/');
  };
  if (!session ) {
    return (
        <div>
            <Button variant={"link"} onClick={handleDiscordSignIn}>
          {buttonText}
        </Button>
        </div>
    )
  } else {
    redirect('/app');
  }

  return (
    <div>
        <Button variant={"link"} onClick={handleLogout}>
          Logout
        </Button>
    </div>
  );
} 