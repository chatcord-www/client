"use client";

import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

interface AvatarCropModalProps {
  imageSrc: string;
  onApply: (croppedFile: File) => void;
  onCancel: () => void;
}

async function getCroppedFile(
  imageSrc: string,
  pixelCrop: Area,
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      resolve(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
    }, "image/jpeg");
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });
}

export function AvatarCropModal({
  imageSrc,
  onApply,
  onCancel,
}: AvatarCropModalProps) {
  const InitialZoom = 1;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(InitialZoom);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const isResetDisabled = zoom === InitialZoom;

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    const file = await getCroppedFile(imageSrc, croppedAreaPixels);
    onApply(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="flex w-[480px] flex-col rounded-lg bg-[#313338] shadow-xl">
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <h2 className="text-lg font-semibold text-white">Edit Image</h2>
          <button
            onClick={onCancel}
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="relative mx-5 mt-3 h-72 overflow-hidden rounded-md bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex items-center gap-3 px-5 py-4">
          <span className="text-xs text-zinc-400">🔍</span>
          <input
            type="range"
            min={1}
            max={2}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(e.target.valueAsNumber)}
            className="h-1 w-full cursor-pointer accent-white"
          />
          <span className="text-xs text-zinc-400">🔍</span>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-zinc-700 px-5 py-4">
          <Button
            variant="ghost"
            type="button"
            onClick={() => setZoom(InitialZoom)}
            disabled={isResetDisabled}
          >
            Reset
          </Button>

          <div className="flex gap-3">
          <Button variant="ghost" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleApply}>
            Apply
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
