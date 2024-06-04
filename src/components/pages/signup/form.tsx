"use client";
import { useForm, Controller } from "react-hook-form";
import { SignupFormSchema, SignupFormType } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const SingupForm = () => {
  const t = useTranslations("signup");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const { handleSubmit, control } = useForm<SignupFormType>({
    resolver: zodResolver(SignupFormSchema),
  });

  const formSubmitHandler = (data: SignupFormType) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(formSubmitHandler)}>
      <Controller
        name="username"
        control={control}
        render={({ field, fieldState }) => (
          <div className="mt-3">
            <Label required>{t("form.username")}</Label>
            <Input {...field} className="pr-8" />
            {fieldState.error && (
              <p className="text-xs text-red-500">
                {t(`errors.${fieldState.error?.message}`)}
              </p>
            )}
          </div>
        )}
      />
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
      <Controller
        name="repeat_password"
        control={control}
        render={({ field, fieldState }) => (
          <div className="mt-3">
            <Label required>{t("form.repeat-password")}</Label>
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
      <Button className="mt-3 w-full">{t("submit")}</Button>
    </form>
  );
};
