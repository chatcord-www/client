import { useRouter } from "@/navigation";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginFormSchema, type LoginFormType } from "./types";

export const useSigninForm = () => {
  const t = useTranslations("login");
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const login = api.auth.login.useMutation();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
  });

  const { handleSubmit, control } = form;

  const submitHandler = async (data: LoginFormType) => {
    setServerError(null);
    try {
      await login.mutateAsync({
        email: data.email,
        password: data.password,
      });

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError("invalid-credentials");
        return;
      }

      router.push("/app");
    } catch (error) {
      if (error instanceof TRPCClientError) {
        const shape = error.shape as { message?: string } | undefined;
        const errorMessage = shape?.message ?? error.message;

        if (errorMessage === "invalid-credentials") {
          setServerError("invalid-credentials");
          return;
        }
      }
      setServerError("invalid-credentials");
    }
  };

  const togglePasswordVisible = () => setPasswordVisible((prev) => !prev);

  return {
    togglePasswordVisible,
    passwordVisible,
    isPending: login.isPending,
    submitHandler,
    serverError,
    handleSubmit,
    control,
    t,
  };
};
