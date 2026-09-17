"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { PaginationMeta } from "@/lib/http/envelope";
import { cn } from "@/lib/utils";
import { NButton } from "../button";
import { NEmpty, NEmptyDescription, NEmptyIcon, NEmptyTitle, NSkeleton } from "../feedback";
import { NInput, NInputAddon, NInputGroup } from "../field";
import { NIcon } from "../media/icon";

export type { ColumnDef };

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    className?: string;
    /** Hide below the md breakpoint. */
    hideOnMobile?: boolean;
  }
}

interface NDataTableProps<T> {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  loading?: boolean;
  /** Server pagination. Omit for client-side paging of `data`. */
  meta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  getRowId?: (row: T) => string;
  empty?: { title: string; description?: string };
  className?: string;
}

export function NDataTable<T>({
  columns,
  data,
  loading,
  meta,
  onPageChange,
  pageSize = 10,
  onRowClick,
  getRowId,
  empty,
  className,
}: NDataTableProps<T>) {
  const manual = Boolean(meta);
  const table = useReactTable({
    data,
    columns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: manual ? undefined : getPaginationRowModel(),
    manualPagination: manual,
    pageCount: meta?.total_pages,
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });

  const rows = table.getRowModel().rows;
  const page = manual ? meta!.page : table.getState().pagination.pageIndex + 1;
  const totalPages = manual ? meta!.total_pages : table.getPageCount();
  const total = manual ? meta!.total : data.length;
  const goTo = (p: number) => (manual ? onPageChange?.(p) : table.setPageIndex(p - 1));
  const colClass = (c: { columnDef: ColumnDef<T, unknown> }) =>
    cn(c.columnDef.meta?.className, c.columnDef.meta?.hideOnMobile && "hidden md:table-cell");

  if (!loading && data.length === 0) {
    return (
      <NEmpty className={className}>
        <NEmptyIcon />
        <NEmptyTitle>{empty?.title ?? "Nothing here yet"}</NEmptyTitle>
        {empty?.description && <NEmptyDescription>{empty.description}</NEmptyDescription>}
      </NEmpty>
    );
  }

  return (
    <div data-slot="data-table" className={cn("overflow-hidden rounded-2xl border border-base-150 bg-base-0", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-base-150 bg-base-50/70">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th key={header.id} scope="col" className={cn("px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap text-base-500 uppercase", colClass(header.column))}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={cn("divide-y divide-base-100 transition-opacity", loading && data.length > 0 && "opacity-60")}>
            {loading && data.length === 0
              ? Array.from({ length: 5 }, (_, i) => (
                  <tr key={i}>
                    {columns.map((c, j) => (
                      <td key={j} className={cn("px-4 py-4", c.meta?.hideOnMobile && "hidden md:table-cell")}>
                        <NSkeleton className="h-4 w-full max-w-40" />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                    className={cn("transition-colors", onRowClick && "cursor-pointer hover:bg-base-50")}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={cn("px-4 py-3.5 align-middle", colClass(cell.column))}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 border-t border-base-100 px-4 py-3 text-sm text-base-500">
          <span className="tabular-nums">
            Page {page} of {totalPages} · {total} total
          </span>
          <div className="flex gap-1.5">
            <NButton size="icon-sm" color="secondary" variant="outline" disabled={page <= 1} onClick={() => goTo(page - 1)} aria-label="Previous page">
              <NIcon name="chevronLeft" />
            </NButton>
            <NButton size="icon-sm" color="secondary" variant="outline" disabled={page >= totalPages} onClick={() => goTo(page + 1)} aria-label="Next page">
              <NIcon name="chevronRight" />
            </NButton>
          </div>
        </div>
      )}
    </div>
  );
}

/** Debounced search box that sits above a table. */
export function NDataTableSearch({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [draft, setDraft] = React.useState(value);
  React.useEffect(() => setDraft(value), [value]);
  React.useEffect(() => {
    if (draft === value) return;
    const t = setTimeout(() => onChange(draft), 300);
    return () => clearTimeout(t);
  }, [draft, value, onChange]);

  return (
    <NInputGroup className={cn("w-full sm:max-w-xs", className)}>
      <NInputAddon>
        <NIcon name="search" />
      </NInputAddon>
      <NInput type="search" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
    </NInputGroup>
  );
}

export function NDataTableTopBar({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="data-table-top-bar" className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)} {...props} />;
}
