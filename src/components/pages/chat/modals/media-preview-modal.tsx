"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, X } from "lucide-react";

type MediaPreviewModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaType: "image" | "video";
  src: string;
};

export function MediaPreviewModal({
  open,
  onOpenChange,
  mediaType,
  src,
}: MediaPreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-none bg-transparent p-0 shadow-none [&>button]:hidden sm:max-w-[92vw]">
        <div className="relative flex max-h-[92vh] items-center justify-center">
          <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
            <Button
              asChild
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full border border-white/10 bg-black/60 text-white hover:bg-black/75"
            >
              <a href={src} target="_blank" rel="noreferrer noopener" aria-label="Open original media">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>

            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full border border-white/10 bg-black/60 text-white hover:bg-black/75"
              onClick={() => onOpenChange(false)}
              aria-label="Close media preview"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {mediaType === "image" ? (
            <img
              src={src}
              alt="uploaded media preview"
              className="max-h-[92vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
            />
          ) : (
            <video
              src={src}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="max-h-[92vh] max-w-[92vw] rounded-lg bg-black shadow-2xl"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}