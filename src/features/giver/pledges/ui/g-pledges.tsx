"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  NAlert,
  NButton,
  NCard,
  NCardAction,
  NCardContent,
  NCardDescription,
  NCardFooter,
  NCardHeader,
  NCardTitle,
  NDataTable,
  NDialog,
  NDialogContent,
  NDialogDescription,
  NDialogFooter,
  NDialogHeader,
  NDialogTitle,
  NField,
  NFieldHint,
  NFieldLabel,
  NIcon,
  NInput,
  NInputAddon,
  NInputGroup,
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
import type { Contribution } from "@/lib/dto";
import { formatDate, formatMoney, formatMonth } from "@/lib/format";
import { cn } from "@/lib/utils";
import { impactFor, PLEDGE_AMOUNTS, pledgeSchema, type PledgeFormOutput, type PledgeFormValues } from "../domain/giver-pledges";
import { useGiverPledges } from "../composition/use-giver-pledges";

function createContributionColumns(): ColumnDef<Contribution, unknown>[] {
  return [
    { header: "Month", cell: ({ row }) => <span className="font-medium">{formatMonth(row.original.month)}</span> },
    { header: "Amount", cell: ({ row }) => <span className="font-semibold tabular-nums">{formatMoney(row.original.amount)}</span> },
    { header: "Status", cell: ({ row }) => <NStatus kind="contribution" status={row.original.status} size="sm" /> },
    { header: "Paid on", cell: ({ row }) => formatDate(row.original.paidAt), meta: { hideOnMobile: true } },
    {
      header: "Reference",
      cell: ({ row }) => <code className="rounded bg-base-100 px-1.5 py-0.5 text-xs">{row.original.reference}</code>,
      meta: { hideOnMobile: true },
    },
  ];
}

function AmountPicker({ value, onPick }: { value: number; onPick: (n: number) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {PLEDGE_AMOUNTS.map((a) => (
        <button
          key={a}
          type="button"
          onClick={() => onPick(a)}
          className={cn(
            "flex h-14 cursor-pointer flex-col items-center justify-center rounded-xl border text-sm font-semibold tabular-nums transition-colors",
            value === a ? "border-accent-500 bg-accent-500 text-base-0" : "border-base-150 bg-base-0 hover:border-accent-150 hover:bg-accent-50",
          )}
        >
          {formatMoney(a)}
          <span className={cn("text-[11px] font-normal", value === a ? "text-base-0/75" : "text-base-500")}>per month</span>
        </button>
      ))}
    </div>
  );
}

export function GPledges() {
  const app = useGiverPledges();
  const columns = React.useMemo(createContributionColumns, []);
  const [payOpen, setPayOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(false);

  const form = useForm<PledgeFormValues, unknown, PledgeFormOutput>({
    resolver: zodResolver(pledgeSchema),
    values: { monthlyAmount: app.pledge?.monthlyAmount ?? 25000 },
  });
  const amount = Number(form.watch("monthlyAmount")) || 0;
  const payAmount = app.pledge?.monthlyAmount ?? amount;

  return (
    <NPage>
      <NPageHeader>
        <NPageHeading>
          <NPageTitle>Pledges &amp; giving</NPageTitle>
          <NPageDescription>Manage your monthly commitment and see every contribution you&apos;ve made.</NPageDescription>
        </NPageHeading>
      </NPageHeader>

      <NStatGrid className="xl:grid-cols-3">
        {app.isLoading ? (
          Array.from({ length: 3 }, (_, i) => <NSkeleton key={i} className="h-[120px] rounded-2xl" />)
        ) : (
          <>
            <NStat tone="brand">
              <NStatLabel icon="naira">Pledged and paid so far</NStatLabel>
              <NStatValue>{formatMoney(app.totals.lifetime)}</NStatValue>
              <NStatHint>{app.totals.count} monthly contributions</NStatHint>
            </NStat>
            <NStat>
              <NStatLabel icon="calendar">Given in {new Date().getFullYear()}</NStatLabel>
              <NStatValue>{formatMoney(app.totals.thisYear)}</NStatValue>
              <NStatHint>Calendar year to date</NStatHint>
            </NStat>
            <NStat tone={app.paidThisMonth ? "default" : "gold"}>
              <NStatLabel icon={app.paidThisMonth ? "complete" : "pending"}>{formatMonth(app.month)}</NStatLabel>
              <NStatValue>{app.paidThisMonth ? "Paid" : "Due"}</NStatValue>
              <NStatHint>{app.paidThisMonth ? "Thank you for giving this month" : "Your contribution for this month"}</NStatHint>
            </NStat>
          </>
        )}
      </NStatGrid>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <NCard>
          <NCardHeader>
            <NCardTitle>Your monthly pledge</NCardTitle>
            <NCardDescription>
              {app.pledge ? `Since ${formatDate(app.pledge.startedAt)}` : "Set up a monthly amount you're comfortable with"}
            </NCardDescription>
            {app.pledge && (
              <NCardAction>
                <NStatus kind="pledge" status={app.pledge.status} />
              </NCardAction>
            )}
          </NCardHeader>
          <NCardContent className="flex flex-col gap-5">
            {app.isLoading ? (
              <NSkeleton className="h-32" />
            ) : editing || !app.pledge ? (
              <form
                id="pledge-form"
                className="flex flex-col gap-4"
                onSubmit={form.handleSubmit((v) => app.savePledge(v.monthlyAmount, () => setEditing(false)))}
              >
                <AmountPicker value={amount} onPick={(a) => form.setValue("monthlyAmount", a, { shouldValidate: true })} />
                <NField error={form.formState.errors.monthlyAmount?.message}>
                  <NFieldLabel>Or enter your own amount</NFieldLabel>
                  <NInputGroup>
                    <NInputAddon>₦</NInputAddon>
                    <NInput type="number" inputMode="numeric" min={1000} step={500} {...form.register("monthlyAmount")} />
                  </NInputGroup>
                  <NFieldHint>{impactFor(amount)}</NFieldHint>
                </NField>
              </form>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="font-display text-5xl font-semibold tabular-nums">
                  {formatMoney(app.pledge.monthlyAmount)}
                  <span className="ml-1 font-sans text-base font-normal text-base-500">/ month</span>
                </p>
                <p className="flex items-start gap-2 text-sm text-base-600">
                  <NIcon name="idea" weight="duotone" className="size-5 text-flow-s3" />
                  {impactFor(app.pledge.monthlyAmount)}
                </p>
              </div>
            )}
          </NCardContent>
          <NCardFooter className="flex-wrap">
            {editing || !app.pledge ? (
              <>
                <NButton type="submit" form="pledge-form" loading={app.isSaving}>
                  {app.pledge ? "Save pledge" : "Start pledging"}
                </NButton>
                {app.pledge && (
                  <NButton color="secondary" variant="ghost" onClick={() => setEditing(false)}>
                    Cancel
                  </NButton>
                )}
              </>
            ) : (
              <>
                <NButton color="secondary" variant="outline" onClick={() => setEditing(true)}>
                  <NIcon name="edit" /> Change amount
                </NButton>
                {app.pledge.status === "active" ? (
                  <NButton color="secondary" variant="ghost" loading={app.isSaving} onClick={() => app.setStatus("paused")}>
                    Pause pledge
                  </NButton>
                ) : (
                  <NButton color="success" variant="soft" loading={app.isSaving} onClick={() => app.setStatus("active")}>
                    Resume pledge
                  </NButton>
                )}
              </>
            )}
          </NCardFooter>
        </NCard>

        <NCard className="overflow-hidden bg-flow-primary pattern-footer text-base-0 [background-blend-mode:soft-light]">
          <NCardHeader>
            <NCardTitle className="text-base-0">Give for {formatMonth(app.month)}</NCardTitle>
            <NCardDescription className="text-base-0/70">
              Your contribution joins the programme pool and is spent on school costs for the children you support. Every spend is itemised.
            </NCardDescription>
          </NCardHeader>
          <NCardContent className="flex flex-1 flex-col justify-end gap-4">
            {app.paidThisMonth ? (
              <div className="flex items-center gap-3 rounded-2xl bg-base-0/10 p-4">
                <NIcon name="complete" weight="fill" className="size-8 text-flow-secondary" />
                <div>
                  <p className="font-semibold">You&apos;re all set for this month</p>
                  <p className="text-sm text-base-0/70">We&apos;ll remind you when next month&apos;s pledge is due.</p>
                </div>
              </div>
            ) : (
              <>
                <p className="font-display text-5xl font-semibold tabular-nums">{formatMoney(payAmount)}</p>
                <NButton
                  color="gold"
                  size="lg"
                  className="w-full sm:w-fit"
                  disabled={app.isLoading || payAmount < 1000}
                  onClick={() => {
                    app.resetPay();
                    setPayOpen(true);
                  }}
                >
                  <NIcon name="pledge" /> Pay {formatMonth(app.month)} contribution
                </NButton>
              </>
            )}
          </NCardContent>
        </NCard>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-sans text-lg font-semibold tracking-normal">Contribution history</h2>
        <NDataTable
          columns={columns}
          data={app.contributions}
          loading={app.isLoading}
          getRowId={(r) => r.id}
          empty={{ title: "No contributions yet", description: "Your payments will be listed here with a reference for each one." }}
        />
      </section>

      <NDialog open={payOpen} onOpenChange={setPayOpen}>
        <NDialogContent>
          <NDialogHeader>
            <NDialogTitle>Confirm your contribution</NDialogTitle>
            <NDialogDescription>
              {formatMoney(payAmount)} for {formatMonth(app.month)}
            </NDialogDescription>
          </NDialogHeader>
          {app.payError && <NAlert tone="danger">{app.payError}</NAlert>}
          <NAlert tone="info">
            <p>
              <strong className="text-accent-600">Demo payment.</strong> No card is charged. Connect a payment provider (e.g. Paystack or
              Flutterwave) in the giver service to take real payments.
            </p>
          </NAlert>
          <NDialogFooter>
            <NButton color="secondary" variant="ghost" onClick={() => setPayOpen(false)}>
              Not now
            </NButton>
            <NButton color="gold" loading={app.isPaying} onClick={() => app.contribute(payAmount, () => setPayOpen(false))}>
              Pay {formatMoney(payAmount)}
            </NButton>
          </NDialogFooter>
        </NDialogContent>
      </NDialog>
    </NPage>
  );
}
