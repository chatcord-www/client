"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LoginFormSchema, LoginFormType } from "./types";

export const LoginForm = () => {
  const t = useTranslations("login");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const { handleSubmit, control } = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
  });

  const formSubmitHandler = (data: LoginFormType) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(formSubmitHandler)}>
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
              <Eye
                onClick={() => setPasswordVisible((prev) => !prev)}
                strokeWidth={1}
                size={18}
                className="absolute right-2 cursor-pointer"
              />
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
      <Button className="mt-3 w-full">{t("submit")}</Button>
    </form>
  );
};
