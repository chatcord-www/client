"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { ContextMenuTrigger } from "@radix-ui/react-context-menu";
import { format } from "date-fns";
import {
  Copy,
  MessageSquareDashed,
  Pencil,
  Reply,
  Trash,
  User2,
} from "lucide-react";
import type { Session } from "next-auth";

type MessageProps = {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  createdAt: Date;
  session: Session;
};

export const Message = ({
  username,
  avatar,
  createdAt,
  message,
  id,
  userId,
  session,
}: MessageProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="py-3 hover:bg-slate-700/10 px-4">
          <div className="flex">
            <Avatar>
              <AvatarFallback>{username[0]}</AvatarFallback>
              <AvatarImage src={avatar} />
            </Avatar>
            <div className="ml-2">
              <div className="flex">
                <div className="text-sm">{username}</div>
                <time className="text-xs ml-2 text-zinc-400">
                  {format(createdAt, "PP")}
                </time>
              </div>
              <div className="text-sm mt-1">{message}</div>
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <div className="flex justify-between items-center w-full gap-3">
            <div className="text-xs">Reply</div>
            <Reply size={15} />
          </div>
        </ContextMenuItem>
        {session.user.id === userId && (
          <ContextMenuItem>
            <div className="flex justify-between items-center w-full gap-3">
              <div className="text-xs">Edit Text</div>
              <Pencil size={15} />
            </div>
          </ContextMenuItem>
        )}
        <ContextMenuItem onClick={() => navigator.clipboard.writeText(message)}>
          <div className="flex justify-between items-center w-full gap-3">
            <div className="text-xs">Copy Text</div>
            <Copy size={15} />
          </div>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => navigator.clipboard.writeText(userId)}>
          <div className="flex justify-between items-center w-full gap-3">
            <div className="text-xs">Copy User ID</div>
            <User2 size={15} />
          </div>
        </ContextMenuItem>
        {session.user.id === userId && (
          <ContextMenuItem danger>
            <div className="flex justify-between items-center w-full gap-3">
              <div className="text-xs">Delete Message</div>
              <Trash size={15} />
            </div>
          </ContextMenuItem>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => navigator.clipboard.writeText(id)}>
          <div className="flex justify-between items-center w-full gap-3">
            <div className="text-xs">Copy Message ID</div>
            <MessageSquareDashed size={15} />
          </div>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
