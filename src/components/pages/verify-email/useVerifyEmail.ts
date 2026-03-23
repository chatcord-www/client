import { useRouter } from "@/navigation";
import { api } from "@/trpc/react";
import { TRPCClientError } from "@trpc/client";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { type KeyboardEvent, useCallback, useRef, useState } from "react";

const CODE_LENGTH = 6;
const knownErrors = new Set(["invalid-code", "token-expired", "email-taken"]);

export const useVerifyEmail = () => {
  const t = useTranslations("verify-email");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [serverError, setServerError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const submittingRef = useRef(false);

  const confirm = api.auth.confirmEmail.useMutation();

  const submit = useCallback(
    async (code: string) => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      setServerError(null);
      try {
        await confirm.mutateAsync({ token, code });
        router.push("/login");
      } catch (error) {
        if (error instanceof TRPCClientError) {
          const shape = error.shape as { message?: string } | undefined;
          const errorMessage = shape?.message ?? error.message;

          if (knownErrors.has(errorMessage)) {
            setServerError(errorMessage);
            setDigits(Array(CODE_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
            submittingRef.current = false;
            return;
          }
        }
        setServerError("unexpected");
        setDigits(Array(CODE_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
        submittingRef.current = false;
      }
    },
    [confirm, router, token],
  );

  const handleChange = useCallback(
    (index: number, value: string) => {
      const digit = value.replace(/\D/g, "").slice(-1);
      setDigits((prev) => {
        const next = [...prev];
        next[index] = digit;

        if (digit && index < CODE_LENGTH - 1) {
           inputRefs.current[index + 1]?.focus();
          }

        const code = next.join("");
        if (code.length === CODE_LENGTH && !next.includes("")) {
          void submit(code);
        }

        return next;
      });
    },
    [submit],
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [digits],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
      if (!pasted) return;

      const next = Array(CODE_LENGTH).fill("") as string[];
      for (let i = 0; i < pasted.length; i++) {
        next[i] = pasted[i]!;
      }
      setDigits(next);

      if (pasted.length === CODE_LENGTH) {
        void submit(pasted);
      } else {
        inputRefs.current[pasted.length]?.focus();
      }
    },
    [submit],
  );

  const setRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    [],
  );

  return {
    isPending: confirm.isPending,
    handleKeyDown,
    handleChange,
    handlePaste,
    serverError,
    digits,
    setRef,
    t,
  };
};
