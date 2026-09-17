"use client";

import useGiverDashboardQueryAdapter from "../adapters/giver-dashboard-query-adapter";
import { useGiverDashboardApp, type GiverDashboardDeps } from "../application/use-giver-dashboard";
import useGiverDashboardServiceAdapter from "../infrastructure/services/giver-dashboard-service-adapter";

/** The swap point: the only place this slice's adapters are named. */
export function useGiverDashboardDeps(): GiverDashboardDeps {
  return { queryPort: useGiverDashboardQueryAdapter(useGiverDashboardServiceAdapter()) };
}

export function useGiverDashboard() {
  return useGiverDashboardApp({ deps: useGiverDashboardDeps() });
}
