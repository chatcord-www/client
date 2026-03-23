"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/navigation";
import { Eye, Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";
import { useSigninForm } from "./useSigninForm";

export const LoginForm = () => {
  const {
    togglePasswordVisible,
    passwordVisible,
    isPending,
    submitHandler,
    serverError,
    handleSubmit,
    control,
    t,
  } = useSigninForm();

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <div className="mt-3">
            <Label required>{t("form.email")}</Label>
            <Input {...field} />
            {fieldState.error && (
              <p className="text-xs text-red-500">
                {t(`errors.${fieldState.error?.message}`)}
              </p>
            )}
          </div>
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <div className="mt-3">
            <Label required>{t("form.password")}</Label>
            <div className="relative flex items-center">
              <Input
                {...field}
                type={!passwordVisible ? "password" : "text"}
                className="pr-8"
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
                {t(`errors.${fieldState.error?.message}`)}
              </p>
            )}
          </div>
        )}
      />
      <div className="flex">
        <Link
          href="/forgot-password"
          className="ml-auto text-xs text-primary hover:underline sm:text-sm"
        >
          {t("forgot")}
        </Link>
      </div>
      {serverError && (
        <p className="mt-2 text-xs text-red-500">{t(`errors.${serverError}`)}</p>
      )}
      <Button type="submit" className="mt-3 w-full" disabled={isPending}>
        {isPending ? <Loader2 className="animate-spin" /> : t("submit")}
      </Button>
    </form>
  );
};
