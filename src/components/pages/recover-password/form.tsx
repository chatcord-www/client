"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";
import { useRecoverPasswordForm } from "./useRecoverPasswordForm";

export const RecoverPasswordForm = () => {
  const {
    step,
    requestedEmail,
    resendCooldown,
    serverError,
    isPending,
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
  } = useRecoverPasswordForm();

  return (
    <div>
      {step === "request" ? (
    <form onSubmit={requestForm.handleSubmit(submitEmail)}>
      <Controller
        name="email"
        control={requestForm.control}
        render={({ field, fieldState }) => (
          <div className="mt-3">
            <Label required>{t("form.email")}</Label>
            <Input {...field} className="pr-8" disabled={isPending} />
            {fieldState.error && (
              <p className="text-xs text-red-500">
                {t(`errors.${fieldState.error.message}`)}
              </p>
            )}
          </div>
        )}
      />
          {serverError && (
            <p className="mt-2 text-xs text-red-500">{t(`errors.${serverError}`)}</p>
          )}
      <Button type="submit" className="mt-3 w-full" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : t("send-code")}
          </Button>
        </form>
      ) : (
        <form onSubmit={resetForm.handleSubmit(submitReset)}>
          <p className="mt-3 text-xs text-muted-foreground">
            {t("email-sent-hint", { email: requestedEmail })}
          </p>
          <Controller
            name="code"
            control={resetForm.control}
            render={({ field, fieldState }) => (
              <div className="mt-3">
                <Label required>{t("form.code")}</Label>
                <Input
                  {...field}
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="one-time-code"
                  disabled={isPending}
                />
                {fieldState.error && (
                  <p className="text-xs text-red-500">
                    {t(`errors.${fieldState.error.message}`)}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="password"
            control={resetForm.control}
            render={({ field, fieldState }) => (
              <div className="mt-3">
                <Label required>{t("form.password")}</Label>
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
                  <p className="text-xs text-red-500">
                    {t(`errors.${fieldState.error.message}`)}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="repeat_password"
            control={resetForm.control}
            render={({ field, fieldState }) => (
              <div className="mt-3">
                <Label required>{t("form.repeat-password")}</Label>
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
                  <p className="text-xs text-red-500">
                    {t(`errors.${fieldState.error.message}`)}
                  </p>
                )}
              </div>
            )}
          />

          {serverError && (
            <p className="mt-2 text-xs text-red-500">{t(`errors.${serverError}`)}</p>
          )}

          <Button type="submit" className="mt-3 w-full" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : t("reset-password")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="mt-2 w-full"
            onClick={resendCode}
            disabled={isPending || resendCooldown > 0}
          >
            {resendCooldown > 0
              ? t("resend-in", { seconds: resendCooldown })
              : t("resend-code")}
          </Button>
          <Button
            type="button"
            variant="link"
            className="mt-2 w-full"
            onClick={goBackToEmailStep}
            disabled={isPending}
          >
            {t("change-email")}
          </Button>
    </form>
      )}
    </div>
  );
};
