import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ChangePasswordFormSchema, type ChangePasswordFormType } from "./types";

const knownErrors = new Set([
  "password-not-match",
  "invalid-current-password",
  "password-not-set",
]);

export const errorToMessage: Record<string, string> = {
  required: "This field is required",
  "password-short": "Password must be at least 8 characters",
  "password-not-match": "Repeated password does not match new password",
  "invalid-current-password": "Current password is incorrect",
  "password-not-set": "Password login is not enabled for this account",
  unexpected: "Could not change password",
};

export const useChangePasswordForm = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = api.user.changePassword.useMutation();

  const form = useForm<ChangePasswordFormType>({
    resolver: zodResolver(ChangePasswordFormSchema),
    defaultValues: { current_password: "", password: "", repeat_password: "" },
  });

  const { handleSubmit, control, reset } = form;

  const submitHandler = async (data: ChangePasswordFormType) => {
    setServerError(null);
    try {
      await mutation.mutateAsync(data);
      reset();
      onSuccess?.();
    } catch (error) {
      if (error instanceof TRPCClientError) {
        const shape = error.shape as { message?: string } | undefined;
        const errorMessage = shape?.message ?? error.message;

        if (knownErrors.has(errorMessage)) {
          setServerError(errorMessage);
          return;
        }
      }

      setServerError("unexpected");
    }
  };

  const getMessage = (key: string | undefined): string | null =>
    key ? (errorToMessage[key] ?? errorToMessage.unexpected ?? null) : null;

  return {
    handleSubmit,
    control,
    submitHandler,
    isPending: mutation.isPending,
    currentPasswordVisible,
    passwordVisible,
    repeatPasswordVisible,
    toggleCurrentPasswordVisible: () => setCurrentPasswordVisible((prev) => !prev),
    togglePasswordVisible: () => setPasswordVisible((prev) => !prev),
    toggleRepeatPasswordVisible: () => setRepeatPasswordVisible((prev) => !prev),
    serverError,
    getMessage,
  };
};
