import { useQuery } from "@tanstack/react-query";
import { adminDashboardKeys } from "../infrastructure/query-keys";
import { toAdminOverview } from "../infrastructure/transformers";
import type { AdminDashboardQueryPort, AdminDashboardServicePort } from "../ports/admin-dashboard.port";

export default function useAdminDashboardQueryAdapter(deps: AdminDashboardServicePort): AdminDashboardQueryPort {
  return {
    useOverviewQuery: () =>
      useQuery({
        queryKey: adminDashboardKeys.overview(),
        queryFn: async () => {
          const res = await deps.getOverview();
          return res?.status && res.data ? toAdminOverview(res.data) : null;
        },
      }),
  };
}
