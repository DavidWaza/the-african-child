import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NIcon } from "../media/icon";

type DivProps = React.ComponentProps<"div">;

export function NPage({ className, ...props }: DivProps) {
  return <div data-slot="page" className={cn("mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8", className)} {...props} />;
}

export function NPageHeader({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="page-header"
      className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}
      {...props}
    />
  );
}

export function NPageHeading({ className, ...props }: DivProps) {
  return <div data-slot="page-heading" className={cn("flex min-w-0 flex-col gap-1", className)} {...props} />;
}

export function NPageEyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="page-eyebrow" className={cn("text-xs font-semibold tracking-[0.14em] text-accent-500 uppercase", className)} {...props} />;
}

export function NPageTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return <h1 data-slot="page-title" className={cn("text-2xl font-semibold text-base-950 md:text-3xl", className)} {...props} />;
}

export function NPageDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="page-description" className={cn("max-w-2xl text-sm text-base-500 md:text-base", className)} {...props} />;
}

export function NPageActions({ className, ...props }: DivProps) {
  return <div data-slot="page-actions" className={cn("flex flex-wrap items-center gap-2", className)} {...props} />;
}

export function NPageBack({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-base-500 transition-colors hover:text-base-900">
      <NIcon name="back" className="size-4" />
      {children}
    </Link>
  );
}

export function NSection({ className, ...props }: React.ComponentProps<"section">) {
  return <section data-slot="section" className={cn("flex flex-col gap-4", className)} {...props} />;
}

export function NSectionTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 data-slot="section-title" className={cn("font-sans text-lg font-semibold tracking-normal text-base-950", className)} {...props} />;
}
