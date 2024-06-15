"use client";
import { useSession } from "next-auth/react";

export default function SettingsDescription() {
  const { data: session } = useSession();
  return (
    <div className="p-4">
      <p className="uppercase text-slate-300 mb-5">My Account</p>
      <div className="">
        <div className="h-16 w-full bg-purple-400 rounded-t-md" />
        <div className=" bg-zinc-400 dark:bg-zinc-700  rounded-b-md">
          <div className="flex items-center gap-4 relative bottom-10">
        <img
          src={session?.user.image ?? ""}
          className="h-[90px] w-[90px] mt-4 ml-2 rounded-full border-[6px] border-popover"
        />
        <p>{session?.user.name}</p>
        </div>
        <div className=" h-40">
       <div className="ml-5 grid gap-2">
       <span className="uppercase text-sm">Username</span>
       <p>{session?.user.name}</p>
       <span className="uppercase text-sm">Email</span>
       <p>{session?.user.email}</p>
       </div>
        </div>
        </div>
      </div>
    </div>
  );
}