import { collectionRate } from "../domain/admin-dashboard";
import type { AdminDashboardQueryPort } from "../ports/admin-dashboard.port";

export interface AdminDashboardDeps {
  queryPort: AdminDashboardQueryPort;
}

export function useAdminDashboardApp({ deps }: { deps: AdminDashboardDeps }) {
  const query = deps.queryPort.useOverviewQuery();
  const overview = query.data ?? null;
  return {
    overview,
    collection: overview ? collectionRate(overview) : null,
    isLoading: query.isLoading,
    isError: query.isError,
    retry: () => query.refetch(),
  };
}
