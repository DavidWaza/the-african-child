import { useMemo } from "react";
import { currentMonthKey } from "@/lib/format";
import { givingTotals } from "../domain/giver-pledges";
import type { GiverPledgesQueryPort } from "../ports/giver-pledges.port";

export interface GiverPledgesDeps {
  queryPort: GiverPledgesQueryPort;
  notify: { success: (message: string) => void; error: (error: unknown) => void };
}

export function useGiverPledgesApp({ deps }: { deps: GiverPledgesDeps }) {
  const pledgeQuery = deps.queryPort.usePledgeQuery();
  const contributionsQuery = deps.queryPort.useContributionsQuery();
  const updateMutation = deps.queryPort.useUpdatePledgeMutation();
  const contributeMutation = deps.queryPort.useContributeMutation();

  const contributions = useMemo(() => contributionsQuery.data ?? [], [contributionsQuery.data]);
  const month = currentMonthKey();
  const paidThisMonth = contributions.some((c) => c.month === month && c.status === "paid");
  const pledge = pledgeQuery.data ?? null;

  return {
    pledge,
    contributions,
    totals: useMemo(() => givingTotals(contributions), [contributions]),
    month,
    paidThisMonth,
    isLoading: pledgeQuery.isLoading || contributionsQuery.isLoading,

    savePledge: (monthlyAmount: number, onDone?: () => void) =>
      updateMutation.mutate(
        { monthlyAmount, status: pledge?.status === "cancelled" ? "active" : (pledge?.status ?? "active") },
        {
          onSuccess: () => {
            deps.notify.success("Your monthly pledge has been updated.");
            onDone?.();
          },
          onError: deps.notify.error,
        },
      ),
    setStatus: (status: "active" | "paused" | "cancelled") =>
      pledge &&
      updateMutation.mutate(
        { monthlyAmount: pledge.monthlyAmount, status },
        {
          onSuccess: () => deps.notify.success(status === "active" ? "Your pledge is active again. Thank you!" : `Your pledge is ${status}.`),
          onError: deps.notify.error,
        },
      ),
    isSaving: updateMutation.isPending,

    contribute: (amount: number, onDone?: () => void) =>
      contributeMutation.mutate(
        { month, amount },
        {
          onSuccess: (c) => {
            deps.notify.success(`Thank you! Payment received · ref ${c.reference}`);
            onDone?.();
          },
          onError: deps.notify.error,
        },
      ),
    isPaying: contributeMutation.isPending,
    payError: contributeMutation.error?.message ?? null,
    resetPay: contributeMutation.reset,
  };
}
