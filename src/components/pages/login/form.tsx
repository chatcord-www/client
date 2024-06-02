"use client";
import { useForm, Controller } from "react-hook-form";
import { LoginFormSchema, LoginFormType } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { useState } from "react";

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
        render={({ field }) => (
          <div className="mt-3">
            <Label required>{t("form.email")}</Label>
            <Input {...field} />
          </div>
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <div className="mt-3">
            <Label required>{t("form.password")}</Label>
            <div className="relative flex items-center">
              <Input {...field} type={!passwordVisible ? "password" : "text"} className="pr-8" />
              <Eye
                onClick={() => setPasswordVisible((prev) => !prev)}
                strokeWidth={1}
                size={18}
                className="absolute right-2 cursor-pointer"
              />
            </div>
          </div>
        )}
      />
      <div className="flex">
        <Link
          href="/forgot-password"
          className="ml-auto text-sm text-primary hover:underline"
        >
          {t("forgot")}
        </Link>
      </div>
      <Button className="mt-3 w-full">Log in</Button>
    </form>
  );
};
