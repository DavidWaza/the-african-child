"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  NAlert,
  NBadge,
  NButton,
  NCheckbox,
  NDataTable,
  NDataTableSearch,
  NDataTableTopBar,
  NDialog,
  NDialogContent,
  NDialogDescription,
  NDialogFooter,
  NDialogHeader,
  NDialogTitle,
  NField,
  NFieldLabel,
  NIcon,
  NInput,
  NPage,
  NPageActions,
  NPageDescription,
  NPageHeader,
  NPageHeading,
  NPageTitle,
  NSelect,
  NStat,
  NStatGrid,
  NStatLabel,
  NStatValue,
  type ColumnDef,
} from "@/components/n";
import { NIGERIAN_STATES } from "@/lib/academics";
import type { School } from "@/lib/dto";
import {
  ADMIN_SCHOOLS_ROUTES,
  EMPTY_SCHOOL_FORM,
  OWNERSHIP_OPTIONS,
  schoolFormSchema,
  schoolToForm,
  type SchoolFormOutput,
  type SchoolFormValues,
} from "../domain/admin-schools";
import { useAdminSchools } from "../composition/use-admin-schools";

interface SchoolColumnHandlers {
  onEdit: (s: School) => void;
  onDelete: (s: School) => void;
}

function createSchoolColumns({ onEdit, onDelete }: SchoolColumnHandlers): ColumnDef<School, unknown>[] {
  return [
    {
      header: "School",
      cell: ({ row: { original: s } }) => (
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-500">
            <NIcon name="school" weight="duotone" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-base-900">{s.name}</p>
            <p className="truncate text-xs text-base-500">Principal: {s.principalName || "—"}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Location",
      cell: ({ row: { original: s } }) => (
        <div>
          <p>{s.state}</p>
          <p className="text-xs text-base-500">{s.lga}</p>
        </div>
      ),
      meta: { hideOnMobile: true },
    },
    {
      header: "Type",
      cell: ({ row }) => (
        <NBadge size="sm" tone="neutral" className="capitalize">
          {row.original.ownership}
        </NBadge>
      ),
      meta: { hideOnMobile: true },
    },
    {
      header: "Children",
      cell: ({ row: { original: s } }) => (
        <Link href={ADMIN_SCHOOLS_ROUTES.childrenAt(s.id)} className="font-semibold text-accent-600 tabular-nums hover:underline">
          {s.childrenCount}
        </Link>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row: { original: s } }) => (
        <div className="flex justify-end gap-1">
          <NButton size="icon-sm" color="secondary" variant="ghost" aria-label={`Edit ${s.name}`} onClick={() => onEdit(s)}>
            <NIcon name="edit" />
          </NButton>
          <NButton
            size="icon-sm"
            color="destructive"
            variant="ghost"
            aria-label={`Remove ${s.name}`}
            disabled={s.childrenCount > 0}
            title={s.childrenCount > 0 ? "Move enrolled children first" : undefined}
            onClick={() => onDelete(s)}
          >
            <NIcon name="delete" />
          </NButton>
        </div>
      ),
    },
  ];
}

function SchoolDialog({
  school,
  open,
  onClose,
  onSubmit,
  loading,
  error,
}: {
  school: School | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (v: SchoolFormOutput) => void;
  loading: boolean;
  error: string | null;
}) {
  const form = useForm<SchoolFormValues, unknown, SchoolFormOutput>({ resolver: zodResolver(schoolFormSchema), defaultValues: EMPTY_SCHOOL_FORM });
  React.useEffect(() => {
    if (open) form.reset(school ? schoolToForm(school) : EMPTY_SCHOOL_FORM);
  }, [open, school, form]);
  const { errors } = form.formState;

  return (
    <NDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <NDialogContent className="max-w-2xl">
        <NDialogHeader>
          <NDialogTitle>{school ? "Edit school" : "Add a secondary school"}</NDialogTitle>
          <NDialogDescription>Partner schools where programme children are enrolled.</NDialogDescription>
        </NDialogHeader>
        <form id="school-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
          {error && <NAlert tone="danger" className="sm:col-span-2">{error}</NAlert>}
          <NField error={errors.name?.message} className="sm:col-span-2">
            <NFieldLabel>School name</NFieldLabel>
            <NInput placeholder="e.g. Community Secondary School, Ikot Ekpene" {...form.register("name")} />
          </NField>
          <NField error={errors.state?.message}>
            <NFieldLabel>State</NFieldLabel>
            <NSelect {...form.register("state")}>
              <option value="">Choose a state</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </NSelect>
          </NField>
          <NField error={errors.lga?.message}>
            <NFieldLabel>LGA</NFieldLabel>
            <NInput {...form.register("lga")} />
          </NField>
          <NField error={errors.address?.message} className="sm:col-span-2">
            <NFieldLabel>Address</NFieldLabel>
            <NInput {...form.register("address")} />
          </NField>
          <NField>
            <NFieldLabel>Ownership</NFieldLabel>
            <NSelect {...form.register("ownership")}>
              {OWNERSHIP_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </NSelect>
          </NField>
          <NField error={errors.principalName?.message}>
            <NFieldLabel>Principal</NFieldLabel>
            <NInput {...form.register("principalName")} />
          </NField>
          <NField>
            <NFieldLabel optional>School phone</NFieldLabel>
            <NInput type="tel" {...form.register("phone")} />
          </NField>
          <NField error={errors.email?.message}>
            <NFieldLabel optional>School email</NFieldLabel>
            <NInput type="email" {...form.register("email")} />
          </NField>
          <NField error={errors.confirmSecondary?.message} className="sm:col-span-2">
            <NCheckbox {...form.register("confirmSecondary")} label="This is a secondary school (JSS and/or SSS classes)." />
          </NField>
        </form>
        <NDialogFooter>
          <NButton color="secondary" variant="ghost" onClick={onClose}>
            Cancel
          </NButton>
          <NButton type="submit" form="school-form" loading={loading}>
            {school ? "Save changes" : "Add school"}
          </NButton>
        </NDialogFooter>
      </NDialogContent>
    </NDialog>
  );
}

export function AdSchools() {
  const app = useAdminSchools();
  const { openEdit, remove } = app;
  const columns = React.useMemo(() => createSchoolColumns({ onEdit: openEdit, onDelete: remove }), [openEdit, remove]);

  return (
    <NPage>
      <NPageHeader>
        <NPageHeading>
          <NPageTitle>Schools</NPageTitle>
          <NPageDescription>Secondary schools where programme children are enrolled.</NPageDescription>
        </NPageHeading>
        <NPageActions>
          <NButton onClick={app.openCreate}>
            <NIcon name="add" /> Add school
          </NButton>
        </NPageActions>
      </NPageHeader>

      <NStatGrid className="grid-cols-3 sm:grid-cols-3 xl:grid-cols-3">
        <NStat className="p-4">
          <NStatLabel icon="school">Schools</NStatLabel>
          <NStatValue className="text-2xl">{app.totals.schools}</NStatValue>
        </NStat>
        <NStat className="p-4">
          <NStatLabel icon="children">Children</NStatLabel>
          <NStatValue className="text-2xl">{app.totals.children}</NStatValue>
        </NStat>
        <NStat className="p-4">
          <NStatLabel icon="location">States</NStatLabel>
          <NStatValue className="text-2xl">{app.totals.states}</NStatValue>
        </NStat>
      </NStatGrid>

      <NDataTableTopBar>
        <NDataTableSearch value={app.search} onChange={app.setSearch} placeholder="Search by name, state or LGA" />
      </NDataTableTopBar>

      <NDataTable
        columns={columns}
        data={app.schools}
        loading={app.isLoading || app.isPlaceholder}
        getRowId={(s) => s.id}
        empty={{ title: "No schools yet", description: "Add the secondary schools your children attend." }}
      />

      <SchoolDialog
        open={app.editing !== null}
        school={app.editing && app.editing !== "new" ? app.editing : null}
        onClose={app.close}
        onSubmit={app.submit}
        loading={app.isSaving}
        error={app.saveError}
      />
    </NPage>
  );
}
