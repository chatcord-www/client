import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CategoryModal } from "./category-modal";
import { ChannelModal } from "./channel-modal";

type ChannelModalProps = {
  modal: "category" | "channel";
  open: boolean;
  setOpen: (value: boolean) => void;
  serverId: string;
  categoryId: string;
  onCategorySelect: (id: string) => void;
};

export const Modals = ({
  children,
  modal,
  open,
  serverId,
  setOpen,
  categoryId,
}: React.PropsWithChildren<ChannelModalProps>) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      {modal === "category" && <CategoryModal serverId={serverId} />}
      {modal === "channel" && (
        <ChannelModal serverId={serverId} categoryId={categoryId} />
      )}
    </Dialog>
  );
};
