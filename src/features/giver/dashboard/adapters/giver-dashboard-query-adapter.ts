import { useQuery } from "@tanstack/react-query";
import { readData } from "@/lib/http/envelope";
import { toChild } from "@/lib/transformers";
import { giverDashboardKeys } from "../infrastructure/query-keys";
import { toGiverOverview } from "../infrastructure/transformers";
import type { GiverDashboardQueryPort, GiverDashboardServicePort } from "../ports/giver-dashboard.port";

export default function useGiverDashboardQueryAdapter(deps: GiverDashboardServicePort): GiverDashboardQueryPort {
  return {
    useOverviewQuery: () =>
      useQuery({
        queryKey: giverDashboardKeys.overview(),
        queryFn: async () => {
          const res = await deps.getOverview();
          return res?.status && res.data ? toGiverOverview(res.data) : null;
        },
      }),
    useChildrenQuery: () =>
      useQuery({
        queryKey: giverDashboardKeys.children(),
        queryFn: async () => readData(await deps.getChildren(), []).map(toChild),
      }),
  };
}
