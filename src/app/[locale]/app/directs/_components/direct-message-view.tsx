"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat-input";
import { Input } from "@/components/ui/input";
import { MessagesProvider } from "@/components/providers/messages";
import { cn } from "@/lib/utils";
import { getActivityColor } from "@/components/pages/directs/types";
import { ChannelContainer } from "@/components/pages/channel/container";
import {
  Phone,
  Search,
  UserPlus,
  Video,
} from "lucide-react";

type DirectMessageFriend = {
  id: string;
  name: string | null;
  image: string | null;
  discriminator: string | null;
  activity: "ONLINE" | "IDLE" | "DND" | "OFFLINE" | null;
};

type DirectMessageViewProps = {
  currentUserId: string;
  friend: DirectMessageFriend;
};

export const DirectMessageView = ({
  currentUserId,
  friend,
}: DirectMessageViewProps) => {
  return (
    <section className="min-w-0 flex-1 h-[calc(100vh-2.25rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#15171d] text-zinc-100">
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
          <MessagesProvider currentUserId={currentUserId} friendId={friend.id}>
            <ChannelContainer currentUserId={currentUserId} friendId={friend.id} />

          <div className="border-t border-white/10 px-4 py-4">
              <ChatInput
                currentUserId={currentUserId}
                friendId={friend.id}
                friendName={friend.name}
              />
              </div>
            </MessagesProvider>
        </div>
      </div>
    </section>
  );
};
