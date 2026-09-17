import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readData, unwrapApiResponse } from "@/lib/http/envelope";
import { toContribution, toPledge } from "@/lib/transformers";
import { giverPledgesKeys } from "../infrastructure/query-keys";
import type { GiverPledgesQueryPort, GiverPledgesServicePort } from "../ports/giver-pledges.port";

export default function useGiverPledgesQueryAdapter(deps: GiverPledgesServicePort): GiverPledgesQueryPort {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: giverPledgesKeys.area });

  return {
    usePledgeQuery: () =>
      useQuery({
        queryKey: giverPledgesKeys.pledge(),
        queryFn: async () => toPledge(readData(await deps.getPledge(), null)),
      }),
    useContributionsQuery: () =>
      useQuery({
        queryKey: giverPledgesKeys.contributions(),
        queryFn: async () => readData(await deps.listContributions(), []).map(toContribution),
      }),
    useUpdatePledgeMutation: () =>
      useMutation({
        mutationFn: async ({ monthlyAmount, status }) => {
          const res = unwrapApiResponse(await deps.updatePledge({ monthly_amount: monthlyAmount, status }), "We couldn't update your pledge.");
          return toPledge(res.data)!;
        },
        onSuccess: invalidate,
      }),
    useContributeMutation: () =>
      useMutation({
        mutationFn: async (input) => toContribution(unwrapApiResponse(await deps.contribute(input), "Your payment didn't go through.").data),
        onSuccess: invalidate,
      }),
  };
}
