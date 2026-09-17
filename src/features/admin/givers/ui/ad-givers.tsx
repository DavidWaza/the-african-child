"use client";

import * as React from "react";
import {
  NAvatar,
  NButton,
  NDataTable,
  NDataTableSearch,
  NDataTableTopBar,
  NDialog,
  NDialogContent,
  NDialogDescription,
  NDialogHeader,
  NDialogTitle,
  NIcon,
  NPage,
  NPageDescription,
  NPageHeader,
  NPageHeading,
  NPageTitle,
  NSkeleton,
  NStat,
  NStatGrid,
  NStatHint,
  NStatLabel,
  NStatus,
  NStatValue,
  type ColumnDef,
} from "@/components/n";
import { formatDate, formatMoney, formatMonth } from "@/lib/format";
import type { GiverRow } from "../domain/admin-givers";
import { useAdminGivers } from "../composition/use-admin-givers";

function createGiverColumns(): ColumnDef<GiverRow, unknown>[] {
  return [
    {
      header: "Giver",
      cell: ({ row: { original: g } }) => (
        <div className="flex items-center gap-3">
          <NAvatar name={g.fullName} className="size-9" />
          <div className="min-w-0">
            <p className="font-semibold text-base-900">{g.fullName}</p>
            <p className="truncate text-xs text-base-500">{g.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Monthly pledge",
      cell: ({ row: { original: g } }) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold tabular-nums">{g.monthlyAmount ? formatMoney(g.monthlyAmount) : "—"}</span>
          {g.pledgeStatus && <NStatus kind="pledge" status={g.pledgeStatus} size="sm" />}
        </div>
      ),
    },
    {
      header: "Given to date",
      cell: ({ row }) => <span className="tabular-nums">{formatMoney(row.original.totalContributed)}</span>,
      meta: { hideOnMobile: true },
    },
    {
      header: "Children",
      cell: ({ row }) =>
        row.original.childrenCount ? (
          <span className="tabular-nums">{row.original.childrenCount}</span>
        ) : (
          <span className="text-xs font-medium text-yellow-600">Not matched</span>
        ),
      meta: { hideOnMobile: true },
    },
    { header: "Joined", cell: ({ row }) => formatDate(row.original.joinedAt), meta: { hideOnMobile: true } },
  ];
}

export function AdGivers() {
  const app = useAdminGivers();
  const columns = React.useMemo(createGiverColumns, []);
  const g = app.selected;

  return (
    <NPage>
      <NPageHeader>
        <NPageHeading>
          <NPageTitle>Givers &amp; pledges</NPageTitle>
          <NPageDescription>Everyone who pledges monthly, what they&apos;ve given, and how many children they support.</NPageDescription>
        </NPageHeading>
      </NPageHeader>

      <NStatGrid>
        <NStat tone="brand">
          <NStatLabel icon="naira">Given to date</NStatLabel>
          <NStatValue>{formatMoney(app.totals.lifetime)}</NStatValue>
          <NStatHint>By {app.totals.givers} givers</NStatHint>
        </NStat>
        <NStat>
          <NStatLabel icon="pledge">Pledged each month</NStatLabel>
          <NStatValue>{formatMoney(app.totals.monthly)}</NStatValue>
          <NStatHint>{app.totals.active} active pledges</NStatHint>
        </NStat>
        <NStat>
          <NStatLabel icon="givers">Givers</NStatLabel>
          <NStatValue>{app.totals.givers}</NStatValue>
          <NStatHint>Registered on the portal</NStatHint>
        </NStat>
        <NStat tone={app.totals.unmatched ? "gold" : "default"}>
          <NStatLabel icon="attention">Awaiting a match</NStatLabel>
          <NStatValue>{app.totals.unmatched}</NStatValue>
          <NStatHint>Match them from a child&apos;s profile</NStatHint>
        </NStat>
      </NStatGrid>

      <NDataTableTopBar>
        <NDataTableSearch value={app.search} onChange={app.setSearch} placeholder="Search by name or email" />
      </NDataTableTopBar>

      <NDataTable
        columns={columns}
        data={app.rows}
        loading={app.isLoading}
        getRowId={(r) => r.id}
        onRowClick={app.select}
        empty={{ title: app.search ? "No givers match that search" : "No givers yet", description: "Givers appear here after signing up on the website." }}
      />

      <NDialog open={g !== null} onOpenChange={(o) => !o && app.select(null)}>
        <NDialogContent side="right">
          {g && (
            <>
              <NDialogHeader>
                <div className="flex items-center gap-3">
                  <NAvatar name={g.fullName} className="size-12" />
                  <div>
                    <NDialogTitle>{g.fullName}</NDialogTitle>
                    <NDialogDescription>Joined {formatDate(g.joinedAt)}</NDialogDescription>
                  </div>
                </div>
              </NDialogHeader>
              <div className="flex flex-wrap gap-2">
                <NButton asChild size="sm" color="secondary" variant="outline">
                  <a href={`mailto:${g.email}`}>
                    <NIcon name="email" /> {g.email}
                  </a>
                </NButton>
                {g.phone && (
                  <NButton asChild size="sm" color="secondary" variant="outline">
                    <a href={`tel:${g.phone}`}>
                      <NIcon name="phone" /> {g.phone}
                    </a>
                  </NButton>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-base-50 p-3">
                  <p className="text-xs text-base-500">Given to date</p>
                  <p className="font-semibold tabular-nums">{formatMoney(g.totalContributed)}</p>
                </div>
                <div className="rounded-xl bg-base-50 p-3">
                  <p className="text-xs text-base-500">Children supported</p>
                  <p className="font-semibold tabular-nums">{g.childrenCount}</p>
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold">Contribution history</p>
                {app.historyLoading ? (
                  <NSkeleton className="h-40" />
                ) : app.history.length ? (
                  <ul className="divide-y divide-base-100 rounded-xl border border-base-150">
                    {app.history.map((c) => (
                      <li key={c.id} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
                        <div>
                          <p className="font-medium">{formatMonth(c.month)}</p>
                          <p className="text-xs text-base-500">{c.reference}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold tabular-nums">{formatMoney(c.amount)}</span>
                          <NStatus kind="contribution" status={c.status} size="sm" />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-base-500">No contributions yet.</p>
                )}
              </div>
            </>
          )}
        </NDialogContent>
      </NDialog>
    </NPage>
  );
}
