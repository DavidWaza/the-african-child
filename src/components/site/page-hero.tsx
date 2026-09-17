import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** Interior page hero: full-bleed photo, dark wash, editorial headline. */
export function PageHero({
  image,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  image: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative isolate flex min-h-[62vh] items-end overflow-hidden bg-flow-primary pt-32 pb-16 text-base-0 md:pb-20", className)}>
      <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(13_58_50/0.55)_0%,rgb(13_58_50/0.35)_40%,rgb(13_58_50/0.92)_100%)]" />
      <div className="container-page">
        <div className="max-w-3xl animate-rise">
          <p className="text-xs font-semibold tracking-[0.18em] text-flow-secondary uppercase">{eyebrow}</p>
          <h1 className="mt-3 text-4xl leading-[1.05] font-semibold text-balance md:text-6xl">{title}</h1>
          {description && <p className="mt-5 max-w-2xl text-lg text-base-0/80 md:text-xl">{description}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={cn("flex max-w-2xl flex-col gap-3", align === "center" && "mx-auto items-center text-center", className)}>
      {eyebrow && <p className={cn("text-xs font-semibold tracking-[0.16em] uppercase", tone === "dark" ? "text-flow-secondary" : "text-accent-500")}>{eyebrow}</p>}
      <h2 className={cn("text-3xl leading-tight font-semibold text-balance md:text-5xl", tone === "dark" ? "text-base-0" : "text-base-950")}>{title}</h2>
      {description && <p className={cn("text-lg", tone === "dark" ? "text-base-0/75" : "text-base-550")}>{description}</p>}
    </div>
  );
}
