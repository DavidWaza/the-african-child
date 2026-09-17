import * as React from "react";
import { cn } from "@/lib/utils";

type DivProps = React.ComponentProps<"div">;

export function NCard({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-5 rounded-2xl border border-base-150 bg-base-0 py-6 text-base-900 shadow-[0_1px_2px_rgb(31_28_23/0.04)]",
        className,
      )}
      {...props}
    />
  );
}

/** Restructures itself into two columns when an NCardAction is present. */
export function NCardHeader({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min items-start gap-1 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        className,
      )}
      {...props}
    />
  );
}

export function NCardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="card-title" className={cn("font-sans text-base font-semibold tracking-normal", className)} {...props} />;
}

export function NCardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="card-description" className={cn("text-sm text-base-500", className)} {...props} />;
}

export function NCardAction({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

export function NCardContent({ className, ...props }: DivProps) {
  return <div data-slot="card-content" className={cn("px-6", className)} {...props} />;
}

export function NCardFooter({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-3 border-t border-base-100 px-6 pt-5", className)}
      {...props}
    />
  );
}
