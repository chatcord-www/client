"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { ChangePasswordForm } from "./form";
import { useChangePasswordForm } from "./useChangePasswordForm";

export function ChangePasswordModal() {
  const [open, setOpen] = useState(false);
  const {
    handleSubmit,
    control,
    submitHandler,
    isPending,
    currentPasswordVisible,
    passwordVisible,
    repeatPasswordVisible,
    toggleCurrentPasswordVisible,
    togglePasswordVisible,
    toggleRepeatPasswordVisible,
    serverError,
    getMessage,
  } = useChangePasswordForm({ onSuccess: () => setOpen(false) });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-8" type="button">
          Change Password
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update your password</DialogTitle>
          <DialogDescription>
            Enter your current password and a new password.
          </DialogDescription>
        </DialogHeader>

        <form id="change-password-form" onSubmit={handleSubmit(submitHandler)}>
          <ChangePasswordForm
            control={control}
            isPending={isPending}
            currentPasswordVisible={currentPasswordVisible}
            passwordVisible={passwordVisible}
            repeatPasswordVisible={repeatPasswordVisible}
            toggleCurrentPasswordVisible={toggleCurrentPasswordVisible}
            togglePasswordVisible={togglePasswordVisible}
            toggleRepeatPasswordVisible={toggleRepeatPasswordVisible}
            serverError={serverError}
            getMessage={getMessage}
          />
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="change-password-form" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : "Done"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
