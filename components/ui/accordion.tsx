"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("mb-4", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group w-full rounded-2xl bg-[rgb(18,18,18)] px-6 py-5 text-left text-lg font-medium text-zinc-200 transition-all",
        "data-[state=open]:rounded-b-none",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        {children}
        <Plus className="h-5 w-5 text-blue-400 transition-transform duration-500 ease-in-out group-data-[state=open]:rotate-45" />
      </div>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-zinc-400",
      "transition-all duration-300 ease-in-out",
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      "bg-[rgb(18,18,18)] rounded-b-2xl",
      className
    )}
    {...props}
  >
    <div className={cn(
      "px-6 py-5",
      "transition-all duration-300 ease-in-out",
      className
    )}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
