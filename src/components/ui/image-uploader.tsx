"use client";
import { ImageIcon } from "@/icons/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useDropzone, type FileWithPath } from "react-dropzone";

export const accept = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

type ImageUploadProps = {
  onFile: (file?: FileWithPath) => void;
  file: File;
  onSave?: () => void;
  loading?: boolean;
  image?: string;
};

export const ImageUpload = ({ onFile, file, image }: ImageUploadProps) => {
  const [blobImage, setBlobImage] = useState<string | undefined>(image);

  const onDrop = (currentFiles: FileWithPath[]) => {
    onFile(currentFiles[0] as FileWithPath);
    const blob = new Blob([currentFiles[0] as File], {
      type: (currentFiles[0] as File).type,
    });
    setBlobImage(URL.createObjectURL(blob));
  };

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept,
  });

  useEffect(() => {
    if (file) {
      const blob = new Blob([file], {
        type: file.type,
      });
      setBlobImage(URL.createObjectURL(blob));
    }
  }, []);

  return (
    <div>
      <div className="relative flex gap-x-3">
        <div
          {...getRootProps()}
          className={cn(
            "relative flex h-36 w-36 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-500/15",
            isDragActive && "bg-primary/20",
          )}
        >
          {blobImage && (
            <img
              src={blobImage}
              alt="Image"
              className="object-Image absolute left-0 top-0 h-full w-full"
            />
          )}
          {!blobImage && <ImageIcon className="size-16 text-primary" />}
        </div>
      </div>
    </div>
  );
};
