"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  NAvatar,
  NButton,
  NDataTable,
  NDataTableSearch,
  NDataTableTopBar,
  NIcon,
  NPage,
  NPageActions,
  NPageDescription,
  NPageHeader,
  NPageHeading,
  NPageTitle,
  NSegmented,
  NSelect,
  NStatus,
  type ColumnDef,
} from "@/components/n";
import { classLevelLabel } from "@/lib/academics";
import type { Child } from "@/lib/dto";
import { formatNumber } from "@/lib/format";
import { ADMIN_CHILDREN_ROUTES, CHILD_STATUS_FILTERS } from "../domain/admin-children";
import { useAdminChildren } from "../composition/use-admin-children";

function createChildrenColumns(): ColumnDef<Child, unknown>[] {
  return [
    {
      header: "Child",
      cell: ({ row: { original: c } }) => (
        <div className="flex items-center gap-3">
          <NAvatar name={c.fullName} src={c.photoUrl} className="size-9" />
          <div className="min-w-0">
            <p className="font-semibold text-base-900">{c.fullName}</p>
            <p className="truncate text-xs text-base-500">
              {classLevelLabel(c.classLevel)} · {c.gender === "female" ? "Girl" : "Boy"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "School",
      cell: ({ row: { original: c } }) => (
        <div className="max-w-56">
          <p className="truncate">{c.schoolName}</p>
          <p className="text-xs text-base-500">{c.state}</p>
        </div>
      ),
      meta: { hideOnMobile: true },
    },
    { header: "Status", cell: ({ row }) => <NStatus kind="child" status={row.original.status} size="sm" /> },
    {
      header: "Sponsors",
      cell: ({ row }) => <span className="tabular-nums">{row.original.sponsorIds.length || "—"}</span>,
      meta: { hideOnMobile: true, className: "text-center" },
    },
    {
      header: "Latest avg.",
      cell: ({ row: { original: c } }) =>
        c.latestAverage != null ? (
          <div className="flex items-center gap-2">
            <span className="font-semibold tabular-nums">{formatNumber(c.latestAverage, 1)}%</span>
          </div>
        ) : (
          <span className="text-base-400">No results</span>
        ),
      meta: { hideOnMobile: true },
    },
    {
      id: "go",
      header: () => <span className="sr-only">Open</span>,
      cell: () => <NIcon name="chevronRight" className="size-4 text-base-400" />,
      meta: { className: "w-8" },
    },
  ];
}

export function AdChildren({ initialStatus, initialSchoolId }: { initialStatus?: string; initialSchoolId?: string }) {
  const router = useRouter();
  const app = useAdminChildren({ initialStatus, initialSchoolId });
  const columns = React.useMemo(createChildrenColumns, []);

  return (
    <NPage>
      <NPageHeader>
        <NPageHeading>
          <NPageTitle>Children</NPageTitle>
          <NPageDescription>Every secondary school student on the programme, their school and family contact.</NPageDescription>
        </NPageHeading>
        <NPageActions>
          <NButton asChild>
            <Link href={ADMIN_CHILDREN_ROUTES.create}>
              <NIcon name="add" /> Add child
            </Link>
          </NButton>
        </NPageActions>
      </NPageHeader>

      <NDataTableTopBar>
        <NSegmented label="Filter by status" value={app.status} onChange={app.onStatus} options={[...CHILD_STATUS_FILTERS]} />
        <div className="flex flex-col gap-2 sm:flex-row">
          <NSelect value={app.schoolId} onChange={(e) => app.onSchool(e.target.value)} aria-label="Filter by school" className="sm:w-56">
            <option value="">All schools</option>
            {app.schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </NSelect>
          <NDataTableSearch value={app.search} onChange={app.onSearch} placeholder="Search child or guardian" />
        </div>
      </NDataTableTopBar>

      <NDataTable
        columns={columns}
        data={app.rows}
        meta={app.meta}
        onPageChange={app.setPage}
        loading={app.isLoading || app.isPlaceholder}
        getRowId={(c) => c.id}
        onRowClick={(c) => router.push(ADMIN_CHILDREN_ROUTES.detail(c.id))}
        empty={
          app.hasFilters
            ? { title: "No children match these filters", description: "Clear a filter or try another name." }
            : { title: "No children registered yet", description: "Add the first child to start matching them with givers." }
        }
      />
    </NPage>
  );
}
