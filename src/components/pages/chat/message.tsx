"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { Textarea } from "@/components/ui/textarea";
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
import { useEffect, useState } from "react";

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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedMessage, setEditedMessage] = useState<string>(message);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setIsEditing(false);
    });
  });
  

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="py-3 hover:bg-slate-700/10 px-4">
          <div className="flex">
            <Avatar>
              <AvatarFallback>{username[0]}</AvatarFallback>
              <AvatarImage src={avatar} />
            </Avatar>
            <div className="ml-2 w-full">
              <div className="flex">
                <div className="text-sm">{username}</div>
                <time className="text-xs ml-2 text-zinc-400">
                  {format(createdAt, "PP")}
                </time>
              </div>
              {isEditing ? (
                <div>
                  <Textarea value={editedMessage} className="w-full" onChange={e => setEditedMessage(e.currentTarget.value)}/>
                  <div className="text-xs">
                    escape to{" "}
                    <span
                      className="cursor-pointer text-blue-400 hover:underline"
                      onClick={() => setIsEditing(false)}
                    >
                      cancel
                    </span>{" "}
                    and enter to{" "}
                    <span className="cursor-pointer text-blue-400 hover:underline">
                      save
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-sm mt-1">{message}</div>
              )}
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
        {
          <ContextMenuItem onClick={() => setIsEditing(true)}>
            <div className="flex justify-between items-center w-full gap-3">
              <div className="text-xs">Edit Text</div>
              <Pencil size={15} />
            </div>
          </ContextMenuItem>
        }
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
        {session?.user?.id === userId && (
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
