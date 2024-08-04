"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import * as React from "react";

import { ChannelModal } from "@/app/[locale]/app/servers/[server_id]/_components/modals/channel-modal";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { Plus, Settings } from "lucide-react";
import { Dialog, DialogTrigger } from "./dialog";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    isAdmin?: boolean;
    onCategorySelect?: (id: string) => void;
    settings?: {
      categoryId: string;
      serverId: string;
    };
  }
>(
  (
    { className, children, settings, isAdmin, onCategorySelect, ...props },
    ref,
  ) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 items-center group py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 mr-1" />
        {children}
        <div className="group-hover:opacity-100 ml-auto opacity-0 transition-all flex gap-2">
          {isAdmin && settings && (
            <Dialog>
              <DialogTrigger asChild>
                <Plus
                  size={14}
                  className="hover:text-white"
                  onClick={() => onCategorySelect?.(settings.categoryId)}
                />
              </DialogTrigger>
              <ChannelModal {...settings} />
            </Dialog>
          )}
          {settings && (
            <Link
              href={`/servers/${settings.serverId}/category/${settings.categoryId}/settings`}
            >
              <Settings size={14} className="hover:text-white" />
            </Link>
          )}
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  ),
);
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
