"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";
import { AvatarCropModal } from "./avatar-crop-modal";
import { BannerColorPicker } from "./banner-color-picker/banner-color-picker";
import { useProfileForm } from "./useProfileForm";

export function ProfileForm() {
  const {
    handleSubmit,
    control,
    submitHandler,
    fileInputRef,
    onPickFile,
    onCropApply,
    onCropCancel,
    cropImageSrc,
    isPending,
    isUploading,
    hasPendingAvatar,
    avatarError,
    feedback,
    email,
    image,
  } = useProfileForm();

  return (
    <form className="mt-3 flex gap-3" onSubmit={handleSubmit(submitHandler)}>
      {cropImageSrc && (
        <AvatarCropModal
          imageSrc={cropImageSrc}
          onApply={onCropApply}
          onCancel={onCropCancel}
        />
      )}
      <div className="w-1/2 space-y-3">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <Label className="text-xs uppercase">Name</Label>
              <Input {...field} />
              {fieldState.error && (
                <p className="text-xs text-red-500">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
        <div>
          <Label className="text-xs uppercase">Email</Label>
          <Input value={email} readOnly disabled />
        </div>
        <Controller
          name="aboutMe"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <Label className="text-xs uppercase">About me</Label>
              <Textarea {...field} className="text-white" />
              {fieldState.error && (
                <p className="text-xs text-red-500">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
        <div>
          <Label className="text-xs uppercase">Avatar</Label>
          <div className="mt-3 flex items-center space-x-4">
            <label
              htmlFor="profile-avatar-input"
              className={`group relative block h-24 w-24 overflow-hidden rounded-full ${
                isUploading || isPending
                  ? "pointer-events-none opacity-70"
                  : "cursor-pointer"
              }`}
            >
            <img
              src={image}
              alt="User avatar"
              className="h-full w-full rounded-full object-cover"
            />
              {!isUploading && !isPending ? (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/0 text-[10px] font-medium uppercase tracking-wide text-white/0 transition-all duration-200 group-hover:bg-black/50 group-hover:text-white">
                  Change
                </span>
              ) : null}
              {isUploading ? (
                <span className="absolute inset-0 flex items-center justify-center bg-black/45">
                  <Loader2 className="animate-spin text-white" size={20} />
                </span>
              ) : null}
            </label>
            <input
              id="profile-avatar-input"
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={onPickFile}
            />
          </div>
          {avatarError && (
            <p className="mt-1 text-xs text-red-500">{avatarError}</p>
          )}
          {hasPendingAvatar && !avatarError && (
            <p className="mt-1 text-xs text-slate-300">
              Previewing selected avatar. Click Save to upload.
            </p>
          )}
          {!hasPendingAvatar && !avatarError && (
            <p className="mt-1 text-xs text-slate-300">
              Click the avatar to choose a new image.
            </p>
          )}
        </div>
        <BannerColorPicker control={control} />
        <div className="flex items-center gap-3">
          <Button size="lg" type="submit" disabled={isPending || isUploading}>
            {isUploading ? "Uploading avatar..." : isPending ? "Saving..." : "Save"}
          </Button>
          {feedback ? (
            <p className="text-xs text-slate-300">{feedback}</p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
