"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { RecoverFormSchema, type RecoverFormType } from "./types";

export const RecoverPasswordForm = () => {
  const t = useTranslations("recover");
  const { handleSubmit, control } = useForm<RecoverFormType>({
    resolver: zodResolver(RecoverFormSchema),
  });

  const formSubmitHandler = (data: RecoverFormType) => {
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
            <Input {...field} className="pr-8" />
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
