import type { Contribution, MonthlyPoint, TermResult } from "@/lib/dto";

export const ADMIN_DASHBOARD_ROUTES = {
  children: "/admin/children",
  newChild: "/admin/children/new",
  child: (id: string) => `/admin/children/${id}`,
  schools: "/admin/schools",
  results: "/admin/results",
  uploadResult: "/admin/results?upload=1",
  givers: "/admin/givers",
} as const;

export interface AdminOverview {
  childrenTotal: number;
  childrenActive: number;
  schoolsTotal: number;
  giversTotal: number;
  totalContributed: number;
  thisMonthContributed: number;
  monthlyPledged: number;
  totalDisbursed: number;
  childrenWithoutSponsor: number;
  childrenWithoutResults: number;
  series: MonthlyPoint[];
  recentResults: TermResult[];
  recentContributions: Contribution[];
}

/** Share of this month's pledged total that has actually been paid. */
export const collectionRate = (o: AdminOverview) =>
  o.monthlyPledged > 0 ? Math.min(100, Math.round((o.thisMonthContributed / o.monthlyPledged) * 100)) : null;
