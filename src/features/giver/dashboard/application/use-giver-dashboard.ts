import { utilisationPercent } from "../domain/giver-dashboard";
import type { GiverDashboardQueryPort } from "../ports/giver-dashboard.port";

export interface GiverDashboardDeps {
  queryPort: GiverDashboardQueryPort;
}

export function useGiverDashboardApp({ deps }: { deps: GiverDashboardDeps }) {
  const overviewQuery = deps.queryPort.useOverviewQuery();
  const childrenQuery = deps.queryPort.useChildrenQuery();
  const overview = overviewQuery.data ?? null;

  return {
    overview,
    children: childrenQuery.data ?? [],
    utilisation: utilisationPercent(overview),
    isLoading: overviewQuery.isLoading,
    childrenLoading: childrenQuery.isLoading,
    isError: overviewQuery.isError,
    retry: () => overviewQuery.refetch(),
  };
}
