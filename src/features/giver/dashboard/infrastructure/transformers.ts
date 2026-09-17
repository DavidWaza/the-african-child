import type { ApiGiverOverview } from "@/lib/api-types";
import { toMonthlySeries, toPledge, toTermResults } from "@/lib/transformers";
import type { GiverOverview } from "../domain/giver-dashboard";

export const toGiverOverview = (o: ApiGiverOverview): GiverOverview => ({
  totalContributed: o.total_contributed ?? 0,
  contributionsCount: o.contributions_count ?? 0,
  monthsActive: o.months_active ?? 0,
  thisMonthPaid: Boolean(o.this_month_paid),
  pledge: toPledge(o.pledge),
  childrenCount: o.children_count ?? 0,
  childrenAverage: o.children_average ?? null,
  totalDisbursedToChildren: o.total_disbursed_to_children ?? 0,
  series: toMonthlySeries(o.monthly_series),
  recentResults: toTermResults(o.recent_results ?? []).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)),
});
