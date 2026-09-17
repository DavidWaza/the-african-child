"use client";

import * as React from "react";
import Link from "next/link";
import {
  NButton,
  NDataTable,
  NDataTableTopBar,
  NDialog,
  NDialogContent,
  NDialogDescription,
  NDialogHeader,
  NDialogTitle,
  NIcon,
  NPage,
  NPageActions,
  NPageDescription,
  NPageHeader,
  NPageHeading,
  NPageTitle,
  NSelect,
  NStatus,
  type ColumnDef,
} from "@/components/n";
import { CrResultSheet } from "@/features/shared/child-record/ui/cr-child-record";
import { academicSessions, classLevelLabel, TERMS } from "@/lib/academics";
import type { TermResult } from "@/lib/dto";
import { formatDate, formatNumber } from "@/lib/format";
import { ADMIN_RESULTS_ROUTES } from "../domain/admin-results";
import { useAdminResults } from "../composition/use-admin-results";
import { AdResultUpload } from "./ad-result-upload";

function createResultColumns(): ColumnDef<TermResult, unknown>[] {
  return [
    {
      header: "Child",
      cell: ({ row: { original: r } }) => (
        <div>
          <p className="font-semibold text-base-900">{r.childName}</p>
          <p className="text-xs text-base-500">{classLevelLabel(r.classLevel)}</p>
        </div>
      ),
    },
    {
      header: "Term",
      cell: ({ row: { original: r } }) => (
        <div>
          <p>{r.termLabel}</p>
          <p className="text-xs text-base-500">{r.session}</p>
        </div>
      ),
    },
    {
      header: "Average",
      cell: ({ row: { original: r } }) => <span className="font-semibold tabular-nums">{r.average != null ? `${formatNumber(r.average, 1)}%` : "—"}</span>,
    },
    {
      header: "Band",
      cell: ({ row }) => (row.original.performance ? <NStatus kind="performance" status={row.original.performance} size="sm" /> : "—"),
      meta: { hideOnMobile: true },
    },
    {
      header: "Sheet",
      cell: ({ row }) =>
        row.original.attachment ? <NIcon name="attachment" className="size-4 text-accent-500" label="Report sheet attached" /> : <span className="text-base-400">—</span>,
      meta: { hideOnMobile: true, className: "text-center" },
    },
    { header: "Uploaded", cell: ({ row }) => formatDate(row.original.uploadedAt), meta: { hideOnMobile: true } },
  ];
}

export function AdResults({ initialUpload, initialChildId }: { initialUpload?: boolean; initialChildId?: string }) {
  const app = useAdminResults({ initialUpload, initialChildId });
  const columns = React.useMemo(createResultColumns, []);

  return (
    <NPage>
      <NPageHeader>
        <NPageHeading>
          <NPageTitle>Results</NPageTitle>
          <NPageDescription>Term report cards for every child. Published results appear on sponsors&apos; dashboards immediately.</NPageDescription>
        </NPageHeading>
        <NPageActions>
          <NButton onClick={() => app.openUpload()}>
            <NIcon name="upload" /> Upload results
          </NButton>
        </NPageActions>
      </NPageHeader>

      <NDataTableTopBar className="sm:justify-start">
        <NSelect value={app.filters.childId} onChange={(e) => app.setChildFilter(e.target.value)} aria-label="Filter by child" className="sm:w-56">
          <option value="">All children</option>
          {app.children.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fullName}
            </option>
          ))}
        </NSelect>
        <NSelect value={app.filters.session} onChange={(e) => app.setSessionFilter(e.target.value)} aria-label="Filter by session" className="sm:w-44">
          <option value="">All sessions</option>
          {academicSessions().map((s) => (
            <option key={s}>{s}</option>
          ))}
        </NSelect>
        <NSelect value={app.filters.term} onChange={(e) => app.setTermFilter(e.target.value)} aria-label="Filter by term" className="sm:w-40">
          <option value="">All terms</option>
          {TERMS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </NSelect>
      </NDataTableTopBar>

      <NDataTable
        columns={columns}
        data={app.rows}
        meta={app.meta}
        onPageChange={app.setPage}
        loading={app.isLoading || app.isPlaceholder}
        getRowId={(r) => r.id}
        onRowClick={app.view}
        empty={
          app.hasFilters
            ? { title: "No results match these filters" }
            : { title: "No results uploaded yet", description: "Upload a child's first term report to share progress with their sponsors." }
        }
      />

      <AdResultUpload
        open={app.uploadOpen}
        onClose={app.closeUpload}
        childOptions={app.children}
        initialChildId={app.uploadChildId}
        onSubmit={app.submitUpload}
        loading={app.isUploading}
        error={app.uploadError}
      />

      <NDialog open={app.viewing !== null} onOpenChange={(o) => !o && app.view(null)}>
        <NDialogContent className="max-w-2xl">
          {app.viewing && (
            <>
              <NDialogHeader>
                <NDialogTitle>{app.viewing.childName}</NDialogTitle>
                <NDialogDescription>
                  {app.viewing.termLabel}, {app.viewing.session}
                </NDialogDescription>
              </NDialogHeader>
              <CrResultSheet
                result={app.viewing}
                footer={
                  <>
                    <NButton asChild size="sm" color="secondary" variant="outline">
                      <Link href={ADMIN_RESULTS_ROUTES.child(app.viewing.childId)}>Open profile</Link>
                    </NButton>
                    <NButton size="sm" color="destructive" variant="soft" loading={app.isRemoving} onClick={() => app.remove(app.viewing!)}>
                      <NIcon name="delete" /> Delete
                    </NButton>
                  </>
                }
              />
            </>
          )}
        </NDialogContent>
      </NDialog>
    </NPage>
  );
}
