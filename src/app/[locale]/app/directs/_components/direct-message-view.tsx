"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getActivityColor } from "@/components/pages/directs/types";
import {
  Gift,
  ImageIcon,
  Phone,
  Plus,
  Search,
  Smile,
  UserPlus,
  Video,
} from "lucide-react";
import { useState } from "react";

type DirectMessageFriend = {
  id: string;
  name: string | null;
  image: string | null;
  discriminator: string | null;
  activity: "ONLINE" | "IDLE" | "DND" | "OFFLINE" | null;
};

type DirectMessageViewProps = {
  friend: DirectMessageFriend;
};

export const DirectMessageView = ({ friend }: DirectMessageViewProps) => {
  const [draft, setDraft] = useState("");

  return (
    <section className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#15171d] text-zinc-100">
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative">
              <Avatar className="size-8">
                <AvatarFallback>{friend.name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
                <AvatarImage src={friend.image ?? undefined} />
              </Avatar>
              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[#15171d]",
                  getActivityColor(friend.activity),
                )}
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-100">
                {friend.name ?? "turbooo"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-zinc-400">
            <Button type="button" variant="ghost" size="icon" className="size-8 rounded-full">
              <Phone className="size-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="size-8 rounded-full">
              <Video className="size-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="size-8 rounded-full">
              <UserPlus className="size-4" />
            </Button>

            <div className="relative ml-1 hidden w-56 md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder={`Search ${friend.name ?? "conversation"}`}
                className="h-8 border-white/10 bg-[#101218] pl-9 text-sm text-zinc-200 placeholder:text-zinc-500"
              />
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
              <div className="border-b border-white/10 pb-6">
                <Avatar className="mb-4 size-20">
                  <AvatarFallback className="text-2xl">
                    {friend.name?.[0]?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                  <AvatarImage src={friend.image ?? undefined} />
                </Avatar>

                <h1 className="text-4xl font-black tracking-tight text-white">
                  {friend.name ?? "Unknown user"}
                </h1>
                <p className="mt-2 text-xl font-semibold text-zinc-300">
                  {friend.name ?? "Unknown user"}
                  {friend.discriminator ? `#${friend.discriminator}` : ""}
                </p>
                <p className="mt-4 text-sm text-zinc-400">
                  This is the beginning of your direct message history with {friend.name ?? "turbostannnn"}.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 px-4 py-4">
            <form onSubmit={(event) => event.preventDefault()}>
              <div className="flex items-center gap-2 rounded-xl bg-[#11131a] px-3 py-2">
                <Button type="button" variant="ghost" size="icon" className="size-8 rounded-full text-zinc-400">
                  <Plus className="size-4" />
                </Button>

                <Input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={`Message @${friend.name ?? "unknown"}`}
                  className="h-10 border-0 bg-transparent px-0 text-sm text-zinc-100 shadow-none ring-0 placeholder:text-zinc-500 focus-visible:ring-0"
                />

                <Button type="button" variant="ghost" size="icon" className="size-8 rounded-full text-zinc-400">
                  <Gift className="size-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="size-8 rounded-full text-zinc-400">
                  <ImageIcon className="size-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="size-8 rounded-full text-zinc-400">
                  <Smile className="size-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
