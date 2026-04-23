"use client";

import { cn } from "@/lib/utils";
import { type SocketMessage } from "@/components/pages/chat/types/socket-message";
import { Paperclip } from "lucide-react";
import {
  type UploadMediaButtonProps,
  useUploadMediaButton,
} from "@/components/pages/chat/actions/useUploadMediaButton";

type UploadMediaButtonComponentProps = UploadMediaButtonProps & {
  onUploaded: (message: SocketMessage) => void;
  onUploadingChange: (isUploading: boolean) => void;
  className?: string;
};

export function UploadMediaButton({
  channelId,
  serverId,
  currentUserId,
  friendId,
  onUploaded,
  onUploadingChange,
  className,
}: UploadMediaButtonComponentProps) {
  const { t, fileInputRef, openFilePicker, onPickFile } = useUploadMediaButton({
    channelId,
    serverId,
    currentUserId,
    friendId,
    onUploaded,
    onUploadingChange,
  });

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={onPickFile}
      />
      <button
        type="button"
        onClick={openFilePicker}
        className={cn(
          "absolute left-2 top-1.5 cursor-pointer text-zinc-400 hover:text-zinc-200",
          className,
        )}
        aria-label={t("upload.button")}
      >
        <Paperclip size={18} />
      </button>
    </>
  );
}