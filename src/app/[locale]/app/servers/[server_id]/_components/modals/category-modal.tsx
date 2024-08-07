"use client";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCategoryChannels } from "@/hooks/category-channels";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { createCategory } from "./actions";

type CategoryModalProps = {
  serverId: string;
};

export const CategoryModal = ({ serverId }: CategoryModalProps) => {
  const t = useTranslations("modals.category");
  const closeModalRef = useRef<HTMLButtonElement>(null);
  const { addCategory } = useCategoryChannels();

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="font-semibold">{t("title")}</DialogTitle>
      </DialogHeader>
      <form
        action={async (e) => {
          const response = await createCategory(e, serverId);

          if (response.success) {
            addCategory({
              serverId,
              channels: [],
              id: response.categoryInfo?.id as string,
              name: response.categoryInfo?.name as string,
            });
            closeModalRef.current?.click();
          }
        }}
      >
        <Label className="text-xs uppercase">{t("label")}</Label>
        <Input placeholder="New Category" name="name" />
        <Button className="w-full mt-3">{t("button")}</Button>
      </form>
      <DialogClose ref={closeModalRef} className="hidden" />
    </DialogContent>
  );
};
