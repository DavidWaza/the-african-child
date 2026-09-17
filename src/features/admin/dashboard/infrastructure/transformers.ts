import type { ApiAdminOverview } from "@/lib/api-types";
import { toContribution, toMonthlySeries, toTermResults } from "@/lib/transformers";
import type { AdminOverview } from "../domain/admin-dashboard";

export const toAdminOverview = (o: ApiAdminOverview): AdminOverview => ({
  childrenTotal: o.children_total ?? 0,
  childrenActive: o.children_active ?? 0,
  schoolsTotal: o.schools_total ?? 0,
  giversTotal: o.givers_total ?? 0,
  totalContributed: o.total_contributed ?? 0,
  thisMonthContributed: o.this_month_contributed ?? 0,
  monthlyPledged: o.monthly_pledged ?? 0,
  totalDisbursed: o.total_disbursed ?? 0,
  childrenWithoutSponsor: o.children_without_sponsor ?? 0,
  childrenWithoutResults: o.children_without_results ?? 0,
  series: toMonthlySeries(o.monthly_series),
  recentResults: toTermResults(o.recent_results ?? []).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)),
  recentContributions: (o.recent_contributions ?? []).map(toContribution),
});
