"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  NAlert,
  NAvatar,
  NButton,
  NCard,
  NCardAction,
  NCardContent,
  NCardDescription,
  NCardHeader,
  NCardTitle,
  NCheckbox,
  NDialog,
  NDialogContent,
  NDialogDescription,
  NDialogFooter,
  NDialogHeader,
  NDialogTitle,
  NEmpty,
  NEmptyIcon,
  NEmptyTitle,
  NField,
  NFieldLabel,
  NIcon,
  NInput,
  NInputAddon,
  NInputGroup,
  NPage,
  NPageBack,
  NSelect,
  NSkeleton,
} from "@/components/n";
import {
  CrChildHero,
  CrDisbursements,
  CrFamilyContact,
  CrResults,
  CrResultsTrend,
  CrSchoolCard,
  CrStory,
} from "@/features/shared/child-record/ui/cr-child-record";
import { DISBURSEMENT_CATEGORIES } from "@/lib/academics";
import { todayIso } from "@/lib/format";
import {
  ADMIN_CHILDREN_ROUTES,
  disbursementSchema,
  type DisbursementFormOutput,
  type DisbursementFormValues,
} from "../domain/admin-children";
import { useAdminChild } from "../composition/use-admin-children";

function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  onConfirm,
  loading,
}: {
  trigger: React.ReactElement<{ onClick?: () => void }>;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  loading?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      {React.cloneElement(trigger, { onClick: () => setOpen(true) })}
      <NDialog open={open} onOpenChange={setOpen}>
        <NDialogContent>
          <NDialogHeader>
            <NDialogTitle>{title}</NDialogTitle>
            <NDialogDescription>{description}</NDialogDescription>
          </NDialogHeader>
          <NDialogFooter>
            <NButton color="secondary" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </NButton>
            <NButton
              color="destructive"
              loading={loading}
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
            >
              {confirmLabel}
            </NButton>
          </NDialogFooter>
        </NDialogContent>
      </NDialog>
    </>
  );
}

function AddSpendDialog({
  open,
  onOpenChange,
  childName,
  onSubmit,
  loading,
  error,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  childName: string;
  onSubmit: (v: DisbursementFormOutput) => void;
  loading: boolean;
  error: string | null;
}) {
  const form = useForm<DisbursementFormValues, unknown, DisbursementFormOutput>({
    resolver: zodResolver(disbursementSchema),
    defaultValues: { category: "tuition", amount: "" as unknown as number, spentOn: todayIso(), note: "" },
  });
  React.useEffect(() => {
    if (open) form.reset({ category: "tuition", amount: "" as unknown as number, spentOn: todayIso(), note: "" });
  }, [open, form]);
  const { errors } = form.formState;

  return (
    <NDialog open={open} onOpenChange={onOpenChange}>
      <NDialogContent>
        <NDialogHeader>
          <NDialogTitle>Record a spend</NDialogTitle>
          <NDialogDescription>Money paid out for {childName}. Sponsors see every entry.</NDialogDescription>
        </NDialogHeader>
        <form id="spend-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
          {error && <NAlert tone="danger" className="sm:col-span-2">{error}</NAlert>}
          <NField className="sm:col-span-2">
            <NFieldLabel>What was it for?</NFieldLabel>
            <NSelect {...form.register("category")}>
              {DISBURSEMENT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </NSelect>
          </NField>
          <NField error={errors.amount?.message}>
            <NFieldLabel>Amount</NFieldLabel>
            <NInputGroup>
              <NInputAddon>₦</NInputAddon>
              <NInput type="number" inputMode="numeric" min={0} {...form.register("amount")} />
            </NInputGroup>
          </NField>
          <NField error={errors.spentOn?.message}>
            <NFieldLabel>Date paid</NFieldLabel>
            <NInput type="date" max={todayIso()} {...form.register("spentOn")} />
          </NField>
          <NField className="sm:col-span-2">
            <NFieldLabel optional>Note</NFieldLabel>
            <NInput placeholder="e.g. Paid to school bursar, receipt #1042" {...form.register("note")} />
          </NField>
        </form>
        <NDialogFooter>
          <NButton color="secondary" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </NButton>
          <NButton type="submit" form="spend-form" loading={loading}>
            Record spend
          </NButton>
        </NDialogFooter>
      </NDialogContent>
    </NDialog>
  );
}

export function AdChild({ id }: { id: string }) {
  const app = useAdminChild(id);
  const [spendOpen, setSpendOpen] = React.useState(false);
  const [sponsorOpen, setSponsorOpen] = React.useState(false);
  const [sponsorDraft, setSponsorDraft] = React.useState<string[]>([]);

  if (app.isLoading || (app.isDeleting && !app.detail)) {
    return (
      <NPage>
        <NSkeleton className="h-48 rounded-3xl" />
        <NSkeleton className="h-96 rounded-2xl" />
      </NPage>
    );
  }

  if (app.notFound || !app.detail) {
    return (
      <NPage>
        <NEmpty>
          <NEmptyIcon name="children" />
          <NEmptyTitle>This child record doesn&apos;t exist</NEmptyTitle>
          <NButton asChild className="mt-3" color="secondary" variant="outline">
            <Link href={ADMIN_CHILDREN_ROUTES.list}>Back to children</Link>
          </NButton>
        </NEmpty>
      </NPage>
    );
  }

  const { child, results, disbursements, totalDisbursed, sponsors, school } = app.detail;

  return (
    <NPage>
      <NPageBack href={ADMIN_CHILDREN_ROUTES.list}>Children</NPageBack>
      <CrChildHero
        child={child}
        actions={
          <>
            <NButton asChild color="gold" size="sm">
              <Link href={ADMIN_CHILDREN_ROUTES.uploadResult(child.id)}>
                <NIcon name="upload" /> Upload results
              </Link>
            </NButton>
            <NButton asChild color="inverse" variant="outline" size="sm">
              <Link href={ADMIN_CHILDREN_ROUTES.edit(child.id)}>
                <NIcon name="edit" /> Edit
              </Link>
            </NButton>
            <ConfirmDialog
              trigger={
                <NButton color="inverse" variant="ghost" size="icon-sm" aria-label="Delete record">
                  <NIcon name="delete" />
                </NButton>
              }
              title={`Delete ${child.fullName}?`}
              description="This removes the profile, every uploaded result and all spending records. Sponsors will no longer see this child. This can't be undone."
              confirmLabel="Delete permanently"
              loading={app.isDeleting}
              onConfirm={app.deleteChild}
            />
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex min-w-0 flex-col gap-6">
          <CrResultsTrend results={results} />
          <CrResults
            results={results}
            renderActions={(r) => (
              <ConfirmDialog
                trigger={
                  <NButton size="sm" color="destructive" variant="ghost">
                    <NIcon name="delete" /> Delete
                  </NButton>
                }
                title="Delete this result?"
                description={`${r.termLabel}, ${r.session} will be removed from ${child.firstName}'s record and from sponsors' dashboards.`}
                confirmLabel="Delete result"
                onConfirm={() => app.deleteResult(r.id)}
              />
            )}
          />
          <CrDisbursements
            disbursements={disbursements}
            total={totalDisbursed}
            action={
              <NButton
                size="sm"
                variant="soft"
                onClick={() => {
                  app.resetSpend();
                  setSpendOpen(true);
                }}
              >
                <NIcon name="add" /> Record spend
              </NButton>
            }
            renderRowAction={(d) => (
              <NButton size="icon-xs" color="neutral" variant="ghost" aria-label={`Remove ${d.categoryLabel}`} onClick={() => app.deleteDisbursement(d.id)}>
                <NIcon name="close" />
              </NButton>
            )}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <NCard>
            <NCardHeader>
              <NCardTitle>Sponsors</NCardTitle>
              <NCardDescription>
                {sponsors.length ? `${sponsors.length} giver${sponsors.length === 1 ? "" : "s"} can see this child` : "Not matched with a giver yet"}
              </NCardDescription>
              <NCardAction>
                <NButton
                  size="sm"
                  color="secondary"
                  variant="outline"
                  onClick={() => {
                    setSponsorDraft(child.sponsorIds);
                    setSponsorOpen(true);
                  }}
                >
                  Manage
                </NButton>
              </NCardAction>
            </NCardHeader>
            {sponsors.length > 0 && (
              <NCardContent>
                <ul className="flex flex-col gap-3">
                  {sponsors.map((s) => (
                    <li key={s.id} className="flex items-center gap-3">
                      <NAvatar name={s.fullName} className="size-9" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{s.fullName}</p>
                        <p className="truncate text-xs text-base-500">{s.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </NCardContent>
            )}
          </NCard>
          <CrFamilyContact child={child} greeting={`Hello ${child.guardian.fullName}, this is The African Child programme team.`} />
          <CrSchoolCard school={school} />
          <CrStory child={child} />
        </div>
      </div>

      <AddSpendDialog
        open={spendOpen}
        onOpenChange={setSpendOpen}
        childName={child.firstName}
        loading={app.isAddingSpend}
        error={app.spendError}
        onSubmit={(v) => app.addDisbursement(v, () => setSpendOpen(false))}
      />

      <NDialog open={sponsorOpen} onOpenChange={setSponsorOpen}>
        <NDialogContent>
          <NDialogHeader>
            <NDialogTitle>Match {child.firstName} with givers</NDialogTitle>
            <NDialogDescription>Selected givers will see {child.firstName}&apos;s profile, results, spending and family contact.</NDialogDescription>
          </NDialogHeader>
          <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
            {app.givers.length === 0 && <p className="text-sm text-base-500">No givers have signed up yet.</p>}
            {app.givers.map((g) => (
              <NCheckbox
                key={g.id}
                className="rounded-xl border border-base-150 p-3 hover:bg-base-50"
                checked={sponsorDraft.includes(g.id)}
                onChange={(e) => setSponsorDraft((d) => (e.target.checked ? [...d, g.id] : d.filter((x) => x !== g.id)))}
                label={
                  <span>
                    <span className="font-medium text-base-900">{g.fullName}</span>
                    <span className="block text-xs text-base-500">
                      Supports {g.childrenCount} child{g.childrenCount === 1 ? "" : "ren"}
                    </span>
                  </span>
                }
              />
            ))}
          </div>
          <NDialogFooter>
            <NButton color="secondary" variant="ghost" onClick={() => setSponsorOpen(false)}>
              Cancel
            </NButton>
            <NButton loading={app.isSavingSponsors} onClick={() => app.setSponsors(sponsorDraft, () => setSponsorOpen(false))}>
              Save sponsors
            </NButton>
          </NDialogFooter>
        </NDialogContent>
      </NDialog>
    </NPage>
  );
}
