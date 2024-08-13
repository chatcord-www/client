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
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Twemoji from "react-twemoji";

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
  const t = useTranslations("channel.message");
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
                  <Textarea
                    value={editedMessage}
                    className="w-full"
                    onChange={(e) => setEditedMessage(e.currentTarget.value)}
                  />
                  <div className="text-xs">
                    {t("editing.esc-to")}{" "}
                    <span
                      className="cursor-pointer text-blue-400 hover:underline"
                      onClick={() => setIsEditing(false)}
                    >
                      {t("editing.cancel")}{" "}
                    </span>
                    {t("editing.and-enter-to")}{" "}
                    <span className="cursor-pointer text-blue-400 hover:underline">
                      {t("editing.save")}
                    </span>
                  </div>
                </div>
              ) : (
                <Twemoji
                  options={{
                    base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
                  }}
                >
                  <p className="text-sm mt-1 flex [&>img]:size-5 gap-1 items-center">
                    {message}
                  </p>
                </Twemoji>
              )}
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <div className="flex justify-between items-center w-full gap-3">
            <div className="text-xs">{t("reply")}</div>
            <Reply size={15} />
          </div>
        </ContextMenuItem>
        {session?.user?.id === userId && (
          <ContextMenuItem onClick={() => setIsEditing(true)}>
            <div className="flex justify-between items-center w-full gap-3">
              <div className="text-xs">{t("edit")}</div>
              <Pencil size={15} />
            </div>
          </ContextMenuItem>
        )}
        <ContextMenuItem onClick={() => navigator.clipboard.writeText(message)}>
          <div className="flex justify-between items-center w-full gap-3">
            <div className="text-xs">{t("copy-text")}</div>
            <Copy size={15} />
          </div>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => navigator.clipboard.writeText(userId)}>
          <div className="flex justify-between items-center w-full gap-3">
            <div className="text-xs">{t("copy-user-id")}</div>
            <User2 size={15} />
          </div>
        </ContextMenuItem>
        {session?.user?.id === userId && (
          <ContextMenuItem danger>
            <div className="flex justify-between items-center w-full gap-3">
              <div className="text-xs">{t("delete-message")}</div>
              <Trash size={15} />
            </div>
          </ContextMenuItem>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => navigator.clipboard.writeText(id)}>
          <div className="flex justify-between items-center w-full gap-3">
            <div className="text-xs">{t("copy-message-id")}</div>
            <MessageSquareDashed size={15} />
          </div>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
