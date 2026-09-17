import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { NIcon } from "../media/icon";

const statVariants = cva("relative flex flex-col gap-3 overflow-hidden rounded-2xl border p-5", {
  variants: {
    tone: {
      default: "border-base-150 bg-base-0 text-base-900",
      brand: "border-flow-primary bg-flow-primary text-base-0 [&_[data-slot=stat-label]]:text-base-0/70 [&_[data-slot=stat-hint]]:text-base-0/70",
      gold: "border-flow-s6 bg-flow-s6 text-base-950 [&_[data-slot=stat-label]]:text-base-600 [&_[data-slot=stat-hint]]:text-base-600",
    },
  },
  defaultVariants: { tone: "default" },
});

export function NStat({ className, tone, ...props }: React.ComponentProps<"div"> & VariantProps<typeof statVariants>) {
  return <div data-slot="stat" className={cn(statVariants({ tone }), className)} {...props} />;
}

export function NStatLabel({ className, icon, children, ...props }: React.ComponentProps<"p"> & { icon?: IconName }) {
  return (
    <p data-slot="stat-label" className={cn("flex items-center gap-2 text-sm font-medium text-base-500", className)} {...props}>
      {icon && <NIcon name={icon} className="size-4.5" weight="duotone" />}
      {children}
    </p>
  );
}

export function NStatValue({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="stat-value"
      className={cn("font-display text-3xl leading-none font-semibold tracking-tight tabular-nums md:text-[2.125rem]", className)}
      {...props}
    />
  );
}

export function NStatHint({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="stat-hint" className={cn("text-xs text-base-500", className)} {...props} />;
}

export function NStatGrid({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="stat-grid" className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", className)} {...props} />;
}
