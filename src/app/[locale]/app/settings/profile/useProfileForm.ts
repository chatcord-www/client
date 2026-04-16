import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ProfileFormSchema, type ProfileFormType } from "./types";

export const useProfileForm = () => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(session?.user.image ?? "");

  useEffect(() => {
    if (!pendingAvatarFile) {
      setPreviewImage(session?.user.image ?? "");
      return;
    }

    const nextPreview = URL.createObjectURL(pendingAvatarFile);
    setPreviewImage(nextPreview);

    return () => {
      URL.revokeObjectURL(nextPreview);
    };
  }, [pendingAvatarFile, session?.user.image]);

  const form = useForm<ProfileFormType>({
    resolver: zodResolver(ProfileFormSchema),
    values: {
      name: session?.user.name ?? "",
      aboutMe: session?.user.aboutMe ?? "",
    },
  });

  const { handleSubmit, control } = form;
  const { mutateAsync: generateUploadUrl } = api.generateSignedUrl.useMutation();

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: async () => {
      setFeedback("Profile saved");
      router.refresh();
      await update();
    },
    onError: () => {
      setFeedback("Could not save profile");
    },
  });

  const submitHandler = async (data: ProfileFormType) => {
    setFeedback(null);
    setAvatarError(null);

    try {
      let image: string | undefined;

      if (pendingAvatarFile) {
        setIsUploading(true);
        const { uploadUrl, fileUrl } = await generateUploadUrl({
          fileName: pendingAvatarFile.name,
          contentType: pendingAvatarFile.type,
          fileSize: pendingAvatarFile.size,
          uploadType: "avatar",
        });

        const result = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": pendingAvatarFile.type },
          body: pendingAvatarFile,
        });

        if (!result.ok) {
          throw new Error("Upload failed");
        }

        image = fileUrl;
      }

      await updateProfile.mutateAsync({
        name: data.name,
        aboutMe: data.aboutMe,
        image,
      });

      setPendingAvatarFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      setAvatarError("Could not upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onPickFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarError(null);
    setPendingAvatarFile(file);
  };

  return {
    handleSubmit,
    control,
    submitHandler,
    fileInputRef,
    openFilePicker,
    onPickFile,
    isPending: updateProfile.isPending,
    isUploading,
    hasPendingAvatar: Boolean(pendingAvatarFile),
    avatarError,
    feedback,
    email: session?.user.email ?? "",
    image: previewImage,
  };
};
