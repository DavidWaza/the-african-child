"use client";

import Link from "next/link";
import {
  NAlert,
  NButton,
  NCard,
  NCardAction,
  NCardContent,
  NCardDescription,
  NCardHeader,
  NCardTitle,
  NColumnChart,
  NIcon,
  NPage,
  NPageActions,
  NPageDescription,
  NPageEyebrow,
  NPageHeader,
  NPageHeading,
  NPageTitle,
  NProgress,
  NSkeleton,
  NStat,
  NStatGrid,
  NStatHint,
  NStatLabel,
  NStatus,
  NStatValue,
} from "@/components/n";
import type { IconName } from "@/lib/icons";
import { formatDate, formatMoney, formatMonth, formatMonthShort, formatNumber } from "@/lib/format";
import { ADMIN_DASHBOARD_ROUTES as ROUTES } from "../domain/admin-dashboard";
import { useAdminDashboard } from "../composition/use-admin-dashboard";

function QuickAction({ href, icon, title, text }: { href: string; icon: IconName; title: string; text: string }) {
  return (
    <Link href={href} className="group flex items-center gap-3 rounded-xl border border-base-150 bg-base-0 p-3.5 transition-colors hover:border-accent-150 hover:bg-accent-50">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-500 group-hover:bg-base-0">
        <NIcon name={icon} weight="duotone" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-base-900">{title}</span>
        <span className="block truncate text-xs text-base-500">{text}</span>
      </span>
      <NIcon name="forward" className="size-4 text-base-400 group-hover:text-accent-500" />
    </Link>
  );
}

export function AdDashboard() {
  const { overview: o, collection, isLoading, isError, retry } = useAdminDashboard();

  return (
    <NPage>
      <NPageHeader>
        <NPageHeading>
          <NPageEyebrow>Programme overview</NPageEyebrow>
          <NPageTitle>Admin dashboard</NPageTitle>
          <NPageDescription>Children, schools, results and giving across the programme.</NPageDescription>
        </NPageHeading>
        <NPageActions>
          <NButton asChild color="secondary" variant="outline">
            <Link href={ROUTES.uploadResult}>
              <NIcon name="upload" /> Upload results
            </Link>
          </NButton>
          <NButton asChild>
            <Link href={ROUTES.newChild}>
              <NIcon name="add" /> Add child
            </Link>
          </NButton>
        </NPageActions>
      </NPageHeader>

      {isError && (
        <NAlert tone="danger">
          The overview didn&apos;t load.{" "}
          <button className="cursor-pointer font-semibold underline" onClick={retry}>
            Retry
          </button>
        </NAlert>
      )}

      {o && (o.childrenWithoutSponsor > 0 || o.childrenWithoutResults > 0) && (
        <div className="grid gap-3 md:grid-cols-2">
          {o.childrenWithoutSponsor > 0 && (
            <NAlert tone="pending">
              <Link href={`${ROUTES.children}?status=pending_review`} className="font-medium hover:underline">
                {o.childrenWithoutSponsor} child{o.childrenWithoutSponsor === 1 ? " is" : "ren are"} waiting to be matched with a giver →
              </Link>
            </NAlert>
          )}
          {o.childrenWithoutResults > 0 && (
            <NAlert tone="info">
              <Link href={ROUTES.uploadResult} className="font-medium hover:underline">
                {o.childrenWithoutResults} active child{o.childrenWithoutResults === 1 ? " has" : "ren have"} no results uploaded yet →
              </Link>
            </NAlert>
          )}
        </div>
      )}

      <NStatGrid>
        {isLoading || !o ? (
          Array.from({ length: 4 }, (_, i) => <NSkeleton key={i} className="h-[132px] rounded-2xl" />)
        ) : (
          <>
            <NStat tone="brand">
              <NStatLabel icon="naira">Total contributed</NStatLabel>
              <NStatValue>{formatMoney(o.totalContributed)}</NStatValue>
              <NStatHint>{formatMoney(o.totalDisbursed)} disbursed to schools and families</NStatHint>
            </NStat>
            <NStat>
              <NStatLabel icon="pledge">This month</NStatLabel>
              <NStatValue>{formatMoney(o.thisMonthContributed)}</NStatValue>
              <div className="flex flex-col gap-1.5">
                <NProgress value={collection ?? 0} />
                <NStatHint>
                  {collection ?? 0}% of {formatMoney(o.monthlyPledged)} pledged
                </NStatHint>
              </div>
            </NStat>
            <NStat>
              <NStatLabel icon="children">Children</NStatLabel>
              <NStatValue>{o.childrenTotal}</NStatValue>
              <NStatHint>
                {o.childrenActive} active in {o.schoolsTotal} school{o.schoolsTotal === 1 ? "" : "s"}
              </NStatHint>
            </NStat>
            <NStat tone="gold">
              <NStatLabel icon="givers">Givers</NStatLabel>
              <NStatValue>{o.giversTotal}</NStatValue>
              <NStatHint>Monthly pledges total {formatMoney(o.monthlyPledged)}</NStatHint>
            </NStat>
          </>
        )}
      </NStatGrid>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <NCard>
          <NCardHeader>
            <NCardTitle>Contributions received</NCardTitle>
            <NCardDescription>All givers, last 9 months</NCardDescription>
          </NCardHeader>
          <NCardContent>
            {isLoading || !o ? (
              <NSkeleton className="h-[220px]" />
            ) : (
              <NColumnChart
                data={o.series.map((p) => ({ key: p.month, label: formatMonthShort(p.month), detail: formatMonth(p.month), value: p.amount }))}
                formatValue={(v) => formatMoney(v)}
                formatAxis={(v) => formatMoney(v, { compact: true })}
                valueLabel="Contributions"
              />
            )}
          </NCardContent>
        </NCard>

        <NCard>
          <NCardHeader>
            <NCardTitle>Quick actions</NCardTitle>
          </NCardHeader>
          <NCardContent className="flex flex-col gap-2">
            <QuickAction href={ROUTES.newChild} icon="child" title="Register a child" text="Profile, school and family contact" />
            <QuickAction href={ROUTES.uploadResult} icon="results" title="Upload term results" text="Scores and the report sheet" />
            <QuickAction href={ROUTES.schools} icon="school" title="Add a secondary school" text="Partner schools on the programme" />
            <QuickAction href={ROUTES.givers} icon="givers" title="Review givers" text="Pledges and contribution history" />
          </NCardContent>
        </NCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <NCard>
          <NCardHeader>
            <NCardTitle>Recently uploaded results</NCardTitle>
            <NCardAction>
              <NButton asChild size="sm" color="secondary" variant="ghost">
                <Link href={ROUTES.results}>
                  All results <NIcon name="forward" />
                </Link>
              </NButton>
            </NCardAction>
          </NCardHeader>
          <NCardContent>
            {isLoading || !o ? (
              <NSkeleton className="h-48" />
            ) : o.recentResults.length ? (
              <ul className="divide-y divide-base-100">
                {o.recentResults.map((r) => (
                  <li key={r.id}>
                    <Link href={ROUTES.child(r.childId)} className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-3 hover:bg-base-50">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{r.childName}</p>
                        <p className="text-xs text-base-500">
                          {r.termLabel}, {r.session}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold tabular-nums">{r.average != null ? `${formatNumber(r.average, 1)}%` : "—"}</span>
                        {r.performance && <NStatus kind="performance" status={r.performance} size="sm" />}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-center text-sm text-base-500">No results uploaded yet.</p>
            )}
          </NCardContent>
        </NCard>

        <NCard>
          <NCardHeader>
            <NCardTitle>Latest contributions</NCardTitle>
            <NCardAction>
              <NButton asChild size="sm" color="secondary" variant="ghost">
                <Link href={ROUTES.givers}>
                  All givers <NIcon name="forward" />
                </Link>
              </NButton>
            </NCardAction>
          </NCardHeader>
          <NCardContent>
            {isLoading || !o ? (
              <NSkeleton className="h-48" />
            ) : o.recentContributions.length ? (
              <ul className="divide-y divide-base-100">
                {o.recentContributions.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{c.giverName}</p>
                      <p className="text-xs text-base-500">
                        {formatMonth(c.month)} · {formatDate(c.paidAt)}
                      </p>
                    </div>
                    <span className="font-semibold tabular-nums">{formatMoney(c.amount)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-center text-sm text-base-500">No contributions yet.</p>
            )}
          </NCardContent>
        </NCard>
      </div>
    </NPage>
  );
}
