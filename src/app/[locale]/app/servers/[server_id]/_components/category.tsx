import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ServerCategoryProps = {
  name: string;
  categoryId: string;
  serverId: string;
};

export const ServerCategory = ({
  children,
  name,
  serverId,
  categoryId,
}: React.PropsWithChildren<ServerCategoryProps>) => {
  return (
    <Accordion type="multiple" defaultValue={[categoryId]}>
      <AccordionItem
        value={categoryId}
        className="border-none"
        defaultChecked={true}
      >
        <AccordionTrigger
          isAdmin={true}
          className="text-xs py-2 px-2 text-zinc-400 uppercase"
          settings={{ categoryId, serverId }}
        >
          {name}
        </AccordionTrigger>
        <AccordionContent className="pb-1 pl-1">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
