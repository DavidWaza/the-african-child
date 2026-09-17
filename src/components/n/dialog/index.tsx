"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { NIcon } from "../media/icon";

export const NDialog = DialogPrimitive.Root;
export const NDialogTrigger = DialogPrimitive.Trigger;
export const NDialogClose = DialogPrimitive.Close;

export function NDialogContent({
  className,
  children,
  side = "center",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { side?: "center" | "right" }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-base-950/45 backdrop-blur-[2px] data-[state=open]:animate-fade" />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed z-50 flex flex-col gap-5 overflow-y-auto border border-base-150 bg-base-0 shadow-2xl outline-none",
          side === "center" &&
            "top-1/2 left-1/2 max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 data-[state=open]:animate-fade",
          side === "right" && "inset-y-0 right-0 h-dvh w-full max-w-md p-6 data-[state=open]:animate-fade sm:rounded-l-2xl",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute top-4 right-4 flex size-9 cursor-pointer items-center justify-center rounded-full text-base-500 transition-colors hover:bg-base-100 hover:text-base-900">
          <NIcon name="close" className="size-4.5" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function NDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-1 pr-8", className)} {...props} />;
}

export function NDialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("text-xl font-semibold text-base-950", className)} {...props} />;
}

export function NDialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn("text-sm text-base-500", className)} {...props} />;
}

export function NDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-footer" className={cn("flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end", className)} {...props} />;
}
