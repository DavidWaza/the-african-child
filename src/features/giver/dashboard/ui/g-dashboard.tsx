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
  NEmpty,
  NEmptyDescription,
  NEmptyIcon,
  NEmptyTitle,
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
import { CrChildCard } from "@/features/shared/child-record/ui/cr-child-record";
import { formatDate, formatMoney, formatMonth, formatMonthShort, formatNumber } from "@/lib/format";
import { useSession } from "@/stores/session-store";
import { GIVER_DASHBOARD_ROUTES as ROUTES } from "../domain/giver-dashboard";
import { useGiverDashboard } from "../composition/use-giver-dashboard";

function greeting() {
  const h = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Africa/Lagos" }).format(new Date()));
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export function GDashboard() {
  const session = useSession();
  const { overview, children, utilisation, isLoading, childrenLoading, isError, retry } = useGiverDashboard();
  const firstName = session?.user.fullName.split(" ")[0] ?? "friend";

  return (
    <NPage>
      <NPageHeader>
        <NPageHeading>
          <NPageEyebrow>{greeting()}</NPageEyebrow>
          <NPageTitle>Welcome back, {firstName}</NPageTitle>
          <NPageDescription>Every naira you give and every result your children earn, in one place.</NPageDescription>
        </NPageHeading>
        <NPageActions>
          <NButton asChild color="secondary" variant="outline">
            <Link href={ROUTES.children}>
              <NIcon name="children" /> My children
            </Link>
          </NButton>
          <NButton asChild color="gold">
            <Link href={ROUTES.pledges}>
              <NIcon name="pledge" /> Give this month
            </Link>
          </NButton>
        </NPageActions>
      </NPageHeader>

      {isError && (
        <NAlert tone="danger">
          We couldn&apos;t load your overview.{" "}
          <button className="cursor-pointer font-semibold underline" onClick={retry}>
            Try again
          </button>
        </NAlert>
      )}

      {overview && !overview.thisMonthPaid && overview.pledge?.status === "active" && (
        <NAlert tone="pending" className="items-center">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Your {formatMoney(overview.pledge.monthlyAmount)} pledge for <strong>{formatMonth(new Date())}</strong> hasn&apos;t been paid yet.
            </span>
            <NButton asChild size="sm" color="gold" className="w-fit">
              <Link href={ROUTES.pledges}>Pay now</Link>
            </NButton>
          </div>
        </NAlert>
      )}

      <NStatGrid>
        {isLoading ? (
          Array.from({ length: 4 }, (_, i) => <NSkeleton key={i} className="h-[132px] rounded-2xl" />)
        ) : (
          <>
            <NStat tone="brand">
              <NStatLabel icon="naira">Total given so far</NStatLabel>
              <NStatValue>{formatMoney(overview?.totalContributed ?? 0)}</NStatValue>
              <NStatHint>
                Across {overview?.monthsActive ?? 0} month{overview?.monthsActive === 1 ? "" : "s"}
              </NStatHint>
            </NStat>
            <NStat>
              <NStatLabel icon="pledge">Monthly pledge</NStatLabel>
              <NStatValue>{overview?.pledge ? formatMoney(overview.pledge.monthlyAmount) : "—"}</NStatValue>
              <NStatHint className="flex items-center gap-2">
                {overview?.pledge ? <NStatus kind="pledge" status={overview.pledge.status} size="sm" /> : "No active pledge"}
              </NStatHint>
            </NStat>
            <NStat>
              <NStatLabel icon="children">Children supported</NStatLabel>
              <NStatValue>{overview?.childrenCount ?? 0}</NStatValue>
              <NStatHint>In secondary school today</NStatHint>
            </NStat>
            <NStat tone="gold">
              <NStatLabel icon="performance">Their average score</NStatLabel>
              <NStatValue>{overview?.childrenAverage != null ? `${formatNumber(overview.childrenAverage, 1)}%` : "—"}</NStatValue>
              <NStatHint>From each child&apos;s latest term</NStatHint>
            </NStat>
          </>
        )}
      </NStatGrid>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <NCard>
          <NCardHeader>
            <NCardTitle>Your monthly giving</NCardTitle>
            <NCardDescription>Paid contributions, last 9 months</NCardDescription>
            <NCardAction>
              <NButton asChild size="sm" color="secondary" variant="ghost">
                <Link href={ROUTES.pledges}>
                  History <NIcon name="forward" />
                </Link>
              </NButton>
            </NCardAction>
          </NCardHeader>
          <NCardContent>
            {isLoading ? (
              <NSkeleton className="h-[220px]" />
            ) : (
              <NColumnChart
                data={(overview?.series ?? []).map((p) => ({
                  key: p.month,
                  label: formatMonthShort(p.month),
                  detail: formatMonth(p.month),
                  value: p.amount,
                }))}
                formatValue={(v) => formatMoney(v)}
                formatAxis={(v) => formatMoney(v, { compact: true })}
                valueLabel="Amount given"
              />
            )}
          </NCardContent>
        </NCard>

        <NCard>
          <NCardHeader>
            <NCardTitle>Where giving has gone</NCardTitle>
            <NCardDescription>Spent on school costs for the children you support (all sponsors combined)</NCardDescription>
          </NCardHeader>
          <NCardContent className="flex flex-col gap-5">
            {isLoading ? (
              <NSkeleton className="h-32" />
            ) : (
              <>
                <div>
                  <p className="font-display text-4xl font-semibold tabular-nums">{formatMoney(overview?.totalDisbursedToChildren ?? 0)}</p>
                  <p className="mt-1 text-sm text-base-500">in fees, uniforms, books, feeding and transport</p>
                </div>
                {utilisation != null && (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-base-500">Compared with what you&apos;ve given</span>
                      <span className="font-semibold tabular-nums">{utilisation}%</span>
                    </div>
                    <NProgress value={utilisation} />
                  </div>
                )}
                <p className="flex items-start gap-2 rounded-xl bg-accent-50 p-3 text-xs text-accent-600">
                  <NIcon name="transparency" weight="fill" className="size-4" />
                  Each receipt is itemised on the child&apos;s page, so you can see exactly what was paid for and when.
                </p>
              </>
            )}
          </NCardContent>
        </NCard>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-sans text-lg font-semibold tracking-normal">Children your giving reaches</h2>
            <p className="text-sm text-base-500">Tap a child to see their results, school and family contact.</p>
          </div>
          {children.length > 3 && (
            <NButton asChild size="sm" color="secondary" variant="ghost">
              <Link href={ROUTES.children}>
                See all {children.length} <NIcon name="forward" />
              </Link>
            </NButton>
          )}
        </div>
        {childrenLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <NSkeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : children.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {children.slice(0, 3).map((c) => (
              <CrChildCard key={c.id} child={c} href={ROUTES.child(c.id)} />
            ))}
          </div>
        ) : (
          <NEmpty>
            <NEmptyIcon name="children" />
            <NEmptyTitle>You&apos;ll be matched with a child soon</NEmptyTitle>
            <NEmptyDescription>
              Our team pairs new givers with children after their first contribution. You&apos;ll see them here with their school results.
            </NEmptyDescription>
          </NEmpty>
        )}
      </section>

      <NCard>
        <NCardHeader>
          <NCardTitle>Latest results</NCardTitle>
          <NCardDescription>Newly uploaded report cards</NCardDescription>
        </NCardHeader>
        <NCardContent>
          {isLoading ? (
            <NSkeleton className="h-40" />
          ) : overview?.recentResults.length ? (
            <ul className="divide-y divide-base-100">
              {overview.recentResults.map((r) => (
                <li key={r.id}>
                  <Link href={ROUTES.child(r.childId)} className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-base-50">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-flow-s6 text-base-900">
                      <NIcon name="results" className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-base-900">{r.childName}</p>
                      <p className="text-xs text-base-500">
                        {r.termLabel}, {r.session} · uploaded {formatDate(r.uploadedAt)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
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
    </NPage>
  );
}
