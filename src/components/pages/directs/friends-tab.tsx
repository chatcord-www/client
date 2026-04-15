"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageCircle, Minus, MoreVertical } from "lucide-react";
import { FriendItem, getActivityColor, getActivityLabel } from "./types";

type FriendsTabProps = {
  items: FriendItem[];
  isBusy: boolean;
  onRemoveFriend: (targetUserId: string) => void;
};

export const FriendsTab = ({
  items,
  isBusy,
  onRemoveFriend,
}: FriendsTabProps) => {
  return (
    <div className="space-y-1">
      {items.map((friend) => {
        return (
          <div
            key={friend.id}
            className="flex items-center justify-between rounded-md border border-transparent px-2 py-2 hover:border-white/10 hover:bg-white/[0.03]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative">
                <Avatar className="size-9">
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
                  {friend.name ?? "Unknown user"}
                </p>
                <p className="truncate text-xs text-zinc-400">
                  {getActivityLabel(friend.activity)}
                  {friend.discriminator ? ` • #${friend.discriminator}` : ""}
                </p>
              </div>
            </div>

            <div className="ml-3 flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8 rounded-full text-zinc-400 hover:bg-zinc-700/40 hover:text-zinc-200"
                disabled
              >
                <MessageCircle className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8 rounded-full text-zinc-400 hover:bg-zinc-700/40 hover:text-zinc-200"
                onClick={() => onRemoveFriend(friend.id)}
                disabled={isBusy}
              >
                <Minus className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8 rounded-full text-zinc-400 hover:bg-zinc-700/40 hover:text-zinc-200"
                disabled
              >
                <MoreVertical className="size-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};