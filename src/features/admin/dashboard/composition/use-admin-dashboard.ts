"use client";

import useAdminDashboardQueryAdapter from "../adapters/admin-dashboard-query-adapter";
import { useAdminDashboardApp, type AdminDashboardDeps } from "../application/use-admin-dashboard";
import useAdminDashboardServiceAdapter from "../infrastructure/services/admin-dashboard-service-adapter";

export function useAdminDashboardDeps(): AdminDashboardDeps {
  return { queryPort: useAdminDashboardQueryAdapter(useAdminDashboardServiceAdapter()) };
}

export function useAdminDashboard() {
  return useAdminDashboardApp({ deps: useAdminDashboardDeps() });
}
