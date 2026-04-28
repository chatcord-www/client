"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import type { ChangePasswordFormType } from "./types";

interface ChangePasswordFormProps {
  control: Control<ChangePasswordFormType>;
  isPending: boolean;
  currentPasswordVisible: boolean;
  passwordVisible: boolean;
  repeatPasswordVisible: boolean;
  toggleCurrentPasswordVisible: () => void;
  togglePasswordVisible: () => void;
  toggleRepeatPasswordVisible: () => void;
  serverError: string | null;
  getMessage: (key: string | undefined) => string | null;
}

export function ChangePasswordForm({
  control,
  isPending,
  currentPasswordVisible,
  passwordVisible,
  repeatPasswordVisible,
  toggleCurrentPasswordVisible,
  togglePasswordVisible,
  toggleRepeatPasswordVisible,
  serverError,
  getMessage,
}: ChangePasswordFormProps) {

  return (
    <>
      <Controller
        name="current_password"
        control={control}
        render={({ field, fieldState }) => (
          <div className="mt-1">
            <Label required>Current Password</Label>
            <div className="relative flex items-center">
              <Input
                {...field}
                type={currentPasswordVisible ? "text" : "password"}
                className="pr-8"
                disabled={isPending}
              />
              <button
                type="button"
                onClick={toggleCurrentPasswordVisible}
                className="absolute right-2"
              >
                <Eye strokeWidth={1} size={18} className="cursor-pointer" />
              </button>
            </div>
            {fieldState.error && (
              <p className="text-xs text-red-500">{getMessage(fieldState.error.message)}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <div className="mt-3">
            <Label required>New Password</Label>
            <div className="relative flex items-center">
              <Input
                {...field}
                type={passwordVisible ? "text" : "password"}
                className="pr-8"
                disabled={isPending}
              />
              <button
                type="button"
                onClick={togglePasswordVisible}
                className="absolute right-2"
              >
                <Eye strokeWidth={1} size={18} className="cursor-pointer" />
              </button>
            </div>
            {fieldState.error && (
              <p className="text-xs text-red-500">{getMessage(fieldState.error.message)}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="repeat_password"
        control={control}
        render={({ field, fieldState }) => (
          <div className="mt-3">
            <Label required>Confirm New Password</Label>
            <div className="relative flex items-center">
              <Input
                {...field}
                type={repeatPasswordVisible ? "text" : "password"}
                className="pr-8"
                disabled={isPending}
              />
              <button
                type="button"
                onClick={toggleRepeatPasswordVisible}
                className="absolute right-2"
              >
                <Eye strokeWidth={1} size={18} className="cursor-pointer" />
              </button>
            </div>
            {fieldState.error && (
              <p className="text-xs text-red-500">{getMessage(fieldState.error.message)}</p>
            )}
          </div>
        )}
      />

      {serverError && (
        <p className="mt-2 text-xs text-red-500">{getMessage(serverError)}</p>
      )}
    </>
  );
}
