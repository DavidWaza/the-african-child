"use client";

import { NIcon, NSkeleton } from "@/components/n";
import type { IconName } from "@/lib/icons";
import { formatMoney, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TRANSPARENCY_STEPS } from "../domain/public-impact";
import { usePublicImpact } from "../composition/use-public-impact";

/** Live headline numbers, for dark brand sections. */
export function PImpactStrip({ className }: { className?: string }) {
  const { impact, isLoading } = usePublicImpact();
  const items = [
    { label: "Children in school", value: impact ? formatNumber(impact.childrenSupported) : null },
    { label: "Given by our community", value: impact ? formatMoney(impact.totalContributed, { compact: true }) : null },
    { label: "Partner secondary schools", value: impact ? formatNumber(impact.schoolsPartnered) : null },
    { label: "Average term score", value: impact?.averageScore != null ? `${formatNumber(impact.averageScore, 0)}%` : impact ? "—" : null },
  ];
  return (
    <dl className={cn("grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-base-0/10 lg:grid-cols-4", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1 bg-flow-primary p-6 md:p-8">
          <dt className="order-2 text-sm text-base-0/65">{item.label}</dt>
          <dd className="order-1 font-display text-4xl font-semibold text-flow-secondary tabular-nums md:text-5xl">
            {isLoading || item.value == null ? <NSkeleton className="h-12 w-24 bg-base-0/10" /> : item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function PImpactReport() {
  const { impact, maxCategory, isLoading } = usePublicImpact();
  const utilised = impact && impact.totalContributed > 0 ? Math.round((impact.totalDisbursed / impact.totalContributed) * 100) : null;

  return (
    <div className="flex flex-col gap-16">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: "naira" as IconName, label: "Received from givers", value: impact && formatMoney(impact.totalContributed), hint: impact && `${impact.giversCount} monthly givers` },
          {
            icon: "disbursement" as IconName,
            label: "Spent on children",
            value: impact && formatMoney(impact.totalDisbursed),
            hint: utilised != null ? `${utilised}% of everything received so far` : null,
          },
          {
            icon: "results" as IconName,
            label: "Report cards published",
            value: impact && formatNumber(impact.resultsPublished),
            hint: impact?.averageScore != null ? `Average score ${formatNumber(impact.averageScore, 1)}%` : null,
          },
        ].map((s) => (
          <div key={s.label} className="flex flex-col gap-3 rounded-3xl border border-base-150 bg-base-0 p-6">
            <span className="flex size-11 items-center justify-center rounded-full bg-accent-50 text-accent-500">
              <NIcon name={s.icon} weight="duotone" />
            </span>
            <p className="text-sm text-base-500">{s.label}</p>
            {isLoading ? <NSkeleton className="h-10 w-40" /> : <p className="font-display text-4xl font-semibold tabular-nums">{s.value ?? "—"}</p>}
            {s.hint && <p className="text-sm text-base-500">{s.hint}</p>}
          </div>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-base-150 bg-base-0 p-6 md:p-8">
          <h3 className="text-2xl font-semibold">Where the money goes</h3>
          <p className="mt-1 text-sm text-base-500">Total spent on children, by category</p>
          <ul className="mt-6 flex flex-col gap-4">
            {isLoading
              ? Array.from({ length: 5 }, (_, i) => <NSkeleton key={i} className="h-8" />)
              : impact?.byCategory.map((c) => (
                  <li key={c.category} className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="font-medium text-base-900">{c.label}</span>
                      <span className="text-base-600 tabular-nums">{formatMoney(c.amount)}</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-base-100" title={`${c.label}: ${formatMoney(c.amount)}`}>
                      <div className="h-full rounded-full bg-chart-1" style={{ width: `${Math.max(2, (c.amount / maxCategory) * 100)}%` }} />
                    </div>
                  </li>
                ))}
          </ul>
        </div>

        <div className="flex flex-col justify-between gap-8 rounded-3xl bg-flow-primary p-6 text-base-0 md:p-8">
          <div>
            <h3 className="text-2xl font-semibold">Where we work</h3>
            <p className="mt-1 text-sm text-base-0/70">States with children currently on the programme</p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {(impact?.states ?? []).map((s) => (
              <li key={s} className="inline-flex items-center gap-1.5 rounded-full bg-base-0/10 px-3 py-1.5 text-sm">
                <NIcon name="location" className="size-4 text-flow-secondary" /> {s}
              </li>
            ))}
          </ul>
          <p className="font-display text-5xl font-semibold text-flow-secondary">
            {impact ? impact.states.length : "—"}
            <span className="ml-2 font-sans text-base font-normal text-base-0/70">states and growing</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function PTransparencySteps({ className }: { className?: string }) {
  return (
    <ol className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {TRANSPARENCY_STEPS.map((step, i) => (
        <li key={step.title} className="relative flex flex-col gap-3 rounded-3xl border border-base-150 bg-base-0 p-6">
          <span className="font-display text-sm font-semibold text-flow-s3">0{i + 1}</span>
          <span className="flex size-12 items-center justify-center rounded-2xl bg-flow-s6 text-base-950">
            <NIcon name={step.icon} weight="duotone" className="size-6" />
          </span>
          <h3 className="text-xl font-semibold">{step.title}</h3>
          <p className="text-sm leading-relaxed text-base-550">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
