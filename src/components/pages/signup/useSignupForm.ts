import { useRouter } from "@/navigation";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SignupFormSchema, type SignupFormType } from "./types";

const knownSignupErrors = new Set(["password-not-match", "email-taken"]);

export const useSignupForm = () => {
  const t = useTranslations("signup");
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const signup = api.auth.signup.useMutation();

  const form = useForm<SignupFormType>({
    resolver: zodResolver(SignupFormSchema),
  });

  const { handleSubmit, control } = form;

  const submitHandler = async (data: SignupFormType) => {
    setServerError(null);
    try {
      await signup.mutateAsync({
        username: data.username,
        email: data.email,
        password: data.password,
        repeat_password: data.repeat_password,
      });
      router.push("/login");
    } catch (error) {
      if (error instanceof TRPCClientError) {
        const errorMessage = error.shape?.message ?? error.message;

        if (knownSignupErrors.has(errorMessage)) {
          setServerError(errorMessage);
          return;
        }
      }

      setServerError("unexpected");
    }
  };

  const togglePasswordVisible = () => setPasswordVisible((prev) => !prev);
  const toggleRepeatPasswordVisible = () => setRepeatPasswordVisible((prev) => !prev);

  return {
    toggleRepeatPasswordVisible,
    togglePasswordVisible,
    repeatPasswordVisible,
    passwordVisible,
    isPending: signup.isPending,
    submitHandler,
    serverError,
    handleSubmit,
    control,
    t,
  };
};
