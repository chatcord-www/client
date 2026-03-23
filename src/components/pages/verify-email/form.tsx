"use client";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useVerifyEmail } from "./useVerifyEmail";

export const VerifyEmailForm = () => {
  const {
    isPending,
    handleKeyDown,
    handleChange,
    handlePaste,
    serverError,
    digits,
    setRef,
    t,
  } = useVerifyEmail();

  return (
    <div>
      <div className="mt-4">
        <Label required>{t("form.code")}</Label>
        <div className="mt-2 flex justify-between gap-2">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={setRef(i)}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              disabled={isPending}
              autoFocus={i === 0}
              className={cn(
                "h-14 w-14 rounded-lg border border-input bg-transparent text-center text-2xl font-semibold shadow-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50",
                serverError && "border-red-500",
              )}
            />
          ))}
        </div>
      </div>
      {isPending && (
        <div className="mt-3 flex justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {serverError && (
        <p className="mt-2 text-center text-xs text-red-500">
          {t(`errors.${serverError}`)}
        </p>
      )}
    </div>
  );
};
