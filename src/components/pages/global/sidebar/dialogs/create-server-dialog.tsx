"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-uploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useServers } from "@/hooks/servers";
import { api } from "@/trpc/react";
import { useRouter } from "@/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import { CreateServerButton } from "../create-server-btn";

type CreateServerFormType = {
  name: string;
  public: boolean;
};

const CreateServerSchema: ZodType<CreateServerFormType> = z.object({
  name: z
    .string({ message: "errors.required" })
    .min(3, { message: "errors.min-3" }),
  public: z.boolean(),
});

export const CreateServerDialog = () => {
  const { addNewServer } = useServers();
  const t = useTranslations("create-server");
  const router = useRouter();
  const [file, setFile] = useState<File>();
  const [openDialog, setOpenDialog] = useState(false);
  const createServer = api.server.create.useMutation();

  const { handleSubmit, control, formState, reset } =
    useForm<CreateServerFormType>({
      resolver: zodResolver(CreateServerSchema),
      defaultValues: { public: false },
    });

  const onSubmit = async (data: CreateServerFormType) => {
    try {
      const server = await createServer.mutateAsync({
        name: data.name,
        public: data.public,
      });

      addNewServer(server);
      setOpenDialog(false);
      setFile(undefined);
      reset();
      router.push(`/app/servers/${server.id}`);
    } catch {
      
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={(value) => setOpenDialog(value)}>
      <DialogTrigger asChild>
        <div>
          <CreateServerButton />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="flex items-center justify-center">
              <ImageUpload onFile={setFile} file={file as File} />
            </div>
            <Label>{t("name")}</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            {formState.errors.name?.message && (
              <p className="text-xs text-destructive">
                {t(formState.errors.name.message)}
              </p>
            )}
            <div className="mt-3 flex items-center gap-1">
              <Label>{t("public")}</Label>
              <TooltipProvider>
                <Tooltip delayDuration={1}>
                  <TooltipTrigger asChild>
                    <Info className="text-zinc-400" size={12} />
                  </TooltipTrigger>
                  <TooltipContent>{t("discovery-info")}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="mt-1">
              <Controller
                control={control}
                name="public"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
          <Button className="mt-3 w-full" disabled={createServer.isPending}>
            {createServer.isPending ? <Loader2 className="animate-spin" /> : t("create")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
