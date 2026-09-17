"use client";

import * as React from "react";
import type { IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { NIcon } from "../media/icon";

export function NSkeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" className={cn("animate-pulse rounded-lg bg-base-100", className)} {...props} />;
}

export function NEmpty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn("flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-base-150 bg-base-0 px-6 py-12 text-center", className)}
      {...props}
    />
  );
}

export function NEmptyIcon({ name = "empty" }: { name?: IconName }) {
  return (
    <span className="mb-1 flex size-12 items-center justify-center rounded-full bg-accent-50 text-accent-500">
      <NIcon name={name} weight="duotone" className="size-6" />
    </span>
  );
}

export function NEmptyTitle({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("font-semibold text-base-900", className)} {...props} />;
}

export function NEmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("max-w-sm text-sm text-base-500", className)} {...props} />;
}

export function NAlert({
  tone = "info",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { tone?: "info" | "danger" | "pending" | "success" }) {
  const styles = {
    info: "border-accent-100 bg-accent-50 text-accent-600",
    danger: "border-red-150 bg-red-50 text-red-600",
    pending: "border-yellow-150 bg-yellow-50 text-yellow-600",
    success: "border-green-150 bg-green-50 text-green-600",
  }[tone];
  const icon: IconName = { info: "info", danger: "attention", pending: "pending", success: "complete" }[tone] as IconName;
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("flex items-start gap-3 rounded-xl border p-3.5 text-sm", styles, className)} {...props}>
      <NIcon name={icon} weight="fill" className="mt-0.5 size-4.5" />
      <div className="min-w-0 flex-1 [&_p]:text-base-600">{children}</div>
    </div>
  );
}

/** A 0–100 meter. The value is always printed beside it, never colour alone. */
export function NProgress({ value, className }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-base-100", className)} role="meter" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-chart-1 transition-[width] duration-700" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function NSegmented<T extends string>({
  value,
  onChange,
  options,
  className,
  label,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; count?: number }[];
  className?: string;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className={cn("inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-base-150 bg-base-0 p-1", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-sm font-medium whitespace-nowrap transition-colors",
            value === o.value ? "bg-flow-primary text-base-0" : "text-base-550 hover:bg-base-100 hover:text-base-900",
          )}
        >
          {o.label}
          {o.count != null && (
            <span className={cn("rounded-full px-1.5 text-[11px] tabular-nums", value === o.value ? "bg-base-0/15" : "bg-base-100")}>{o.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

/** Renders children only after hydration. Portal roots fed by client-resolved queries sit inside this. */
export function NClientOnly({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  return mounted ? children : fallback;
}

export function NDescriptionList({ className, items }: { className?: string; items: { label: string; value: React.ReactNode }[] }) {
  return (
    <dl className={cn("grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-col gap-0.5">
          <dt className="text-xs font-medium tracking-wide text-base-500 uppercase">{item.label}</dt>
          <dd className="text-sm break-words text-base-900">{item.value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
