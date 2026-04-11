"use client";

import { Paperclip } from "lucide-react";
import {
  type UploadMediaButtonProps,
  useUploadMediaButton,
} from "@/components/pages/chat/actions/useUploadMediaButton";

export function UploadMediaButton({
  channelId,
  serverId,
  onUploaded,
  onUploadingChange,
}: UploadMediaButtonProps) {
  const { t, fileInputRef, openFilePicker, onPickFile } = useUploadMediaButton({
    channelId,
    serverId,
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
        className="absolute left-2 top-1.5 cursor-pointer text-zinc-400 hover:text-zinc-200"
        aria-label={t("upload.button")}
      >
        <Paperclip size={18} />
      </button>
    </>
  );
}