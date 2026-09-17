import type { Child, MonthlyPoint, Pledge, TermResult } from "@/lib/dto";

export const GIVER_DASHBOARD_ROUTES = {
  home: "/giver",
  children: "/giver/children",
  child: (id: string) => `/giver/children/${id}`,
  pledges: "/giver/pledges",
} as const;

/** This slice's own read model of the overview payload. */
export interface GiverOverview {
  totalContributed: number;
  contributionsCount: number;
  monthsActive: number;
  thisMonthPaid: boolean;
  pledge: Pledge | null;
  childrenCount: number;
  childrenAverage: number | null;
  totalDisbursedToChildren: number;
  series: MonthlyPoint[];
  recentResults: TermResult[];
}

export interface GiverDashboardData {
  overview: GiverOverview | null;
  children: Child[];
}

/** Share of the giver's money that has already reached a child's school costs. */
export function utilisationPercent(overview: GiverOverview | null): number | null {
  if (!overview || overview.totalContributed <= 0) return null;
  return Math.min(100, Math.round((overview.totalDisbursedToChildren / overview.totalContributed) * 100));
}
