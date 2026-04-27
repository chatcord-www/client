"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, MessageCircle, MoreVertical, X } from "lucide-react";
import { IncomingRequestItem, getActivityColor } from "./types";

type IncomingRequestsTabProps = {
  items: IncomingRequestItem[];
  isBusy: boolean;
  onAccept: (requesterId: string) => void;
  onDecline: (requesterId: string) => void;
};

export const IncomingRequestsTab = ({
  items,
  isBusy,
  onAccept,
  onDecline,
}: IncomingRequestsTabProps) => {
  return (
    <div className="space-y-1">
      {items.map((request) => {
        const user = request.sender;

        return (
          <div
            key={request.id}
            className="flex items-center justify-between rounded-md border border-transparent px-2 py-2 hover:border-white/10 hover:bg-white/[0.03]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative">
                <Avatar className="size-9">
                  <AvatarFallback>{user.name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
                  <AvatarImage src={user.image ?? undefined} />
                </Avatar>
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[#15171d]",
                    getActivityColor(user.activity),
                  )}
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-100">
                  {user.name ?? "Unknown user"}
                </p>
                <p className="truncate text-xs text-zinc-400">
                  Incoming friend request
                  {user.discriminator ? ` • #${user.discriminator}` : ""}
                </p>
              </div>
            </div>

            <div className="ml-3 flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant="secondary"
                disabled={isBusy}
                onClick={() => onAccept(user.id)}
                className="size-8 rounded-full bg-zinc-700/70 hover:bg-zinc-600"
              >
                <Check className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                disabled={isBusy}
                onClick={() => onDecline(user.id)}
                className="size-8 rounded-full bg-zinc-700/70 hover:bg-red-500/20"
              >
                <X className="size-4" />
              </Button>

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
