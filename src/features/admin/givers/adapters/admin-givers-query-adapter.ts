import { useQuery } from "@tanstack/react-query";
import { readData } from "@/lib/http/envelope";
import { toContribution } from "@/lib/transformers";
import { adminGiversKeys } from "../infrastructure/query-keys";
import type { AdminGiversQueryPort, AdminGiversServicePort } from "../ports/admin-givers.port";

export default function useAdminGiversQueryAdapter(deps: AdminGiversServicePort): AdminGiversQueryPort {
  return {
    useGiversQuery: () =>
      useQuery({
        queryKey: adminGiversKeys.list(),
        queryFn: async () =>
          readData(await deps.list(), []).map((g) => ({
            id: g.id,
            fullName: g.full_name,
            email: g.email,
            phone: g.phone ?? null,
            monthlyAmount: g.monthly_amount ?? null,
            pledgeStatus: g.pledge_status ?? null,
            totalContributed: g.total_contributed ?? 0,
            childrenCount: g.children_count ?? 0,
            joinedAt: g.joined_at,
          })),
      }),
    useContributionsQuery: ({ giverId }) => {
      const id = giverId();
      return useQuery({
        queryKey: adminGiversKeys.contributions(id ?? ""),
        queryFn: async () => readData(await deps.contributions(id!), []).map(toContribution),
        enabled: Boolean(id),
      });
    },
  };
}
