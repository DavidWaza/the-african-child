import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { resolveStatus, STATUS_TONE_CLASSES, type StatusKind, type StatusTone } from "@/lib/status";
import { cn } from "@/lib/utils";
import { NIcon } from "../media/icon";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 rounded-full border font-medium whitespace-nowrap [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "h-5 px-2 text-[11px] [&_svg]:size-3",
        default: "h-6 px-2.5 text-xs [&_svg]:size-3.5",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export function NBadge({
  tone = "neutral",
  size,
  className,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { tone?: StatusTone }) {
  const t = STATUS_TONE_CLASSES[tone];
  return <span data-slot="badge" className={cn(badgeVariants({ size }), t.fg, t.bg, t.bd, className)} {...props} />;
}

/** One component for every backend state string. Never branch on status at a call site. */
export function NStatus({
  status,
  kind,
  size,
  className,
}: {
  status: string | null | undefined;
  kind: StatusKind;
  size?: VariantProps<typeof badgeVariants>["size"];
  className?: string;
}) {
  const def = resolveStatus(kind, status);
  return (
    <NBadge tone={def.tone} size={size} className={className}>
      <NIcon name={def.icon} weight="bold" />
      {def.label}
    </NBadge>
  );
}
