"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants> & { required?: boolean }
>(({ className, ...props }, ref) => (
  <>
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        labelVariants(),
        `${className} ${
          props.required &&
          'relative before:absolute before:-right-2 before:top-0 before:text-red-500 before:content-["*"]'
        }`,
      )}
      {...props}
    />
  </>
));

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
