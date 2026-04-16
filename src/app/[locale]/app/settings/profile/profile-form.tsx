"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";
import { useProfileForm } from "./useProfileForm";

export function ProfileForm() {
  const {
    handleSubmit,
    control,
    submitHandler,
    fileInputRef,
    openFilePicker,
    onPickFile,
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
            <img
              src={image}
              alt="User avatar"
              className="h-24 w-24 rounded-full object-cover"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={onPickFile}
            />
            <Button
              variant="secondary"
              type="button"
              disabled={isUploading || isPending}
              onClick={openFilePicker}
            >
              {isUploading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : hasPendingAvatar ? (
                "Avatar selected"
              ) : (
                "Change avatar"
              )}
            </Button>
          </div>
          {avatarError && (
            <p className="mt-1 text-xs text-red-500">{avatarError}</p>
          )}
          {hasPendingAvatar && !avatarError && (
            <p className="mt-1 text-xs text-slate-300">
              Previewing selected avatar. Click Save to upload.
            </p>
          )}
        </div>
        <div>
          <Label className="text-xs uppercase">Banner color</Label>
          <div>
            <div className="h-10 w-16 rounded-sm bg-pink-400" />
          </div>
        </div>
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
