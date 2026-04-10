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
  User2,
} from "lucide-react";
import type { Session } from "next-auth";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { DeleteMessageButton } from "@/components/pages/chat/actions/delete-message-button";
import Twemoji from "react-twemoji";

type MessageProps = {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  createdAt: Date;
  session: Session;
  editedAt?: Date;
  onEditMessage: (params: { messageId: string; newContent: string }) => Promise<any>;
};

export const Message = ({
  username,
  avatar,
  createdAt,
  message,
  id,
  userId,
  session,
  editedAt,
  onEditMessage,
}: MessageProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const t = useTranslations("channel.message");
  const [editedMessage, setEditedMessage] = useState<string>(message);
  const utils = api.useUtils?.();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsEditing(false);
      if (isEditing && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isEditing, editedMessage]);

  const handleSave = async () => {
    const trimmed = editedMessage.trim();
    if (trimmed === message) return;
    if (!trimmed) return;
    try {
      await onEditMessage({
        messageId: id,
        newContent: trimmed,
      });
      await utils?.getMessages?.invalidate?.();
      setIsEditing(false);
    } catch (error) {
      console.log("Failed to edit message:", error);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="py-3 hover:bg-slate-700/10 px-4 cursor-default">
          <div className="flex">
            <Avatar>
              <AvatarFallback>{username[0]}</AvatarFallback>
              <AvatarImage src={avatar} />
            </Avatar>
            <div className="ml-2 w-full">
              <div className="flex items-center gap-2">
                <div className="text-sm">{username}</div>
                <time className="text-xs text-zinc-400">
                  {format(createdAt, "PPpp")}
                </time>
              </div>
              {isEditing ? (
                <div>
                  <Textarea
                    value={editedMessage}
                    className="w-full"
                    onChange={(e) => setEditedMessage(e.currentTarget.value)}
                    autoFocus
                  />
                  <div className="text-xs mt-1 flex gap-2 items-center">
                    {t("editing.esc-to")} 
                    <span
                      className="cursor-pointer text-blue-400 hover:underline"
                      onClick={() => setIsEditing(false)}
                    >
                      {t("editing.cancel")}
                    </span>
                    {t("editing.and-enter-to")}
                    <button
                      className="cursor-pointer text-blue-400 hover:underline disabled:opacity-50"
                      onClick={handleSave}
                      disabled={editedMessage.trim() === message}
                    >
                      {t("editing.save")}
                    </button>
                  </div>
                </div>
              ) : (
                <Twemoji
                  options={{
                    base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
                  }}
                >
                  <div className="flex gap-1 mt-1 [&>img]:size-5 items-center">
                  <p className="text-sm">
                    {message}
                  </p>
                  <p>{editedAt && (<span className="text-xs text-gray-500">(edited)</span>)}</p>
                  </div>
                </Twemoji>
              )}
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent forceMount>
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
          <DeleteMessageButton
            messageId={id}
            username={username}
            avatar={avatar}
            content={message}
            createdAt={createdAt}
          />
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
