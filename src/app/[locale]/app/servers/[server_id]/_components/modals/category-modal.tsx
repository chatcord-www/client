"use client";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogTitle } from "@radix-ui/react-dialog";
import { createCategory } from "./actions";
import { useTranslations } from "next-intl";

type CategoryModalProps = {
  setOpen: (value: boolean) => void;
  serverId: string;
};

export const CategoryModal = ({ setOpen, serverId }: CategoryModalProps) => {
  const t = useTranslations("modals.category")

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="font-semibold">{t('title')}</DialogTitle>
      </DialogHeader>
      <form
        action={async (e) => {
          const response = await createCategory(e, serverId);
          
          if (response.success) {
            setOpen(false);
          }
        }}
      >
        <Label className="text-xs uppercase">{t('label')}</Label>
        <Input placeholder="New Category" name="name" />
        <Button className="w-full mt-3">{t('button')}</Button>
      </form>
    </DialogContent>
  );
};
