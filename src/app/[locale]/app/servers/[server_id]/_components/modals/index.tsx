import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CategoryModal } from "./category-modal";
import { ChannelModal } from "./channel-modal";

type ChannelModalProps = {
  serverId: string;
  modal: "category" | "channel";
};

export const Modals = ({
  children,
  modal,
}: React.PropsWithChildren<ChannelModalProps>) => {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      {modal === "category" && <CategoryModal />}
      {modal === "channel" && <ChannelModal />}
    </Dialog>
  );
};
