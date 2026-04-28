import { useRouter } from "@/navigation";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  RecoverRequestFormSchema,
  RecoverResetFormSchema,
  type RecoverRequestFormType,
  type RecoverResetFormType,
} from "./types";

type RecoverStep = "request" | "reset";
const RESEND_COOLDOWN_SECONDS = 60;

const knownRecoverErrors = new Set([
  "invalid-code",
  "token-expired",
  "password-not-match",
]);

export const useRecoverPasswordForm = () => {
  const t = useTranslations("recover");
  const router = useRouter();

  const [step, setStep] = useState<RecoverStep>("request");
  const [token, setToken] = useState("");
  const [requestedEmail, setRequestedEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const requestCode = api.auth.requestPasswordResetCode.useMutation();
  const resetPassword = api.auth.resetPassword.useMutation();

  const requestForm = useForm<RecoverRequestFormType>({
    resolver: zodResolver(RecoverRequestFormSchema),
  });

  const resetForm = useForm<RecoverResetFormType>({
    resolver: zodResolver(RecoverResetFormSchema),
  });

  const submitEmail = async (data: RecoverRequestFormType) => {
    setServerError(null);
    try {
      const result = await requestCode.mutateAsync({ email: data.email });
      setToken(result.token);
      setRequestedEmail(data.email);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setStep("reset");
    } catch (error) {
      if (error instanceof TRPCClientError) {
        const shape = error.shape as { message?: string } | undefined;
        const errorMessage = shape?.message ?? error.message;

        if (knownRecoverErrors.has(errorMessage)) {
          setServerError(errorMessage);
          return;
        }
      }

      setServerError("unexpected");
    }
  };

  const resendCode = async () => {
    if (!requestedEmail || resendCooldown > 0) return;
    setServerError(null);

    try {
      const result = await requestCode.mutateAsync({ email: requestedEmail });
      setToken(result.token);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      setServerError("unexpected");
    }
  };

  const submitReset = async (data: RecoverResetFormType) => {
    setServerError(null);
    try {
      await resetPassword.mutateAsync({
        token,
        code: data.code,
        password: data.password,
        repeat_password: data.repeat_password,
      });
      router.push("/login");
    } catch (error) {
      if (error instanceof TRPCClientError) {
        const shape = error.shape as { message?: string } | undefined;
        const errorMessage = shape?.message ?? error.message;

        if (knownRecoverErrors.has(errorMessage)) {
          setServerError(errorMessage);
          return;
        }
      }

      setServerError("unexpected");
    }
  };

  const goBackToEmailStep = () => {
    setStep("request");
    setToken("");
    setRequestedEmail("");
    setResendCooldown(0);
    setServerError(null);
    resetForm.reset();
  };

  useEffect(() => {
    if (step !== "reset" || resendCooldown <= 0) return;

    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, resendCooldown]);

  const togglePasswordVisible = () => setPasswordVisible((prev) => !prev);
  const toggleRepeatPasswordVisible = () => setRepeatPasswordVisible((prev) => !prev);

  return {
    step,
    requestedEmail,
    resendCooldown,
    serverError,
    isPending: requestCode.isPending || resetPassword.isPending,
    passwordVisible,
    repeatPasswordVisible,
    togglePasswordVisible,
    toggleRepeatPasswordVisible,
    goBackToEmailStep,
    resendCode,
    submitEmail,
    submitReset,
    requestForm,
    resetForm,
    t,
  };
};
