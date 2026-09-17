import { useQuery } from "@tanstack/react-query";
import { disbursementLabel } from "@/lib/academics";
import { publicImpactKeys } from "../infrastructure/query-keys";
import type { PublicImpactQueryPort, PublicImpactServicePort } from "../ports/public-impact.port";

export default function usePublicImpactQueryAdapter(deps: PublicImpactServicePort): PublicImpactQueryPort {
  return {
    useImpactQuery: () =>
      useQuery({
        queryKey: publicImpactKeys.root,
        queryFn: async () => {
          const res = await deps.getImpact();
          if (!res?.status || !res.data) return null;
          const d = res.data;
          return {
            childrenSupported: d.children_supported,
            schoolsPartnered: d.schools_partnered,
            states: d.states ?? [],
            giversCount: d.givers_count,
            totalContributed: d.total_contributed,
            totalDisbursed: d.total_disbursed,
            averageScore: d.average_score ?? null,
            resultsPublished: d.results_published,
            byCategory: (d.disbursed_by_category ?? []).map((c) => ({ ...c, label: disbursementLabel(c.category) })),
          };
        },
      }),
  };
}
