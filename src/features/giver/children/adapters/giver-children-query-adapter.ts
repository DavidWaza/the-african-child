import { useQuery } from "@tanstack/react-query";
import { readData } from "@/lib/http/envelope";
import { toChild, toChildDetail } from "@/lib/transformers";
import { giverChildrenKeys } from "../infrastructure/query-keys";
import type { GiverChildrenQueryPort, GiverChildrenServicePort } from "../ports/giver-children.port";

export default function useGiverChildrenQueryAdapter(deps: GiverChildrenServicePort): GiverChildrenQueryPort {
  return {
    useChildrenQuery: () =>
      useQuery({
        queryKey: giverChildrenKeys.list(),
        queryFn: async () => readData(await deps.list(), []).map(toChild),
      }),
    useChildQuery: ({ id }) => {
      const childId = id();
      return useQuery({
        queryKey: giverChildrenKeys.detail(childId),
        queryFn: async () => {
          const res = await deps.detail(childId);
          return res?.status && res.data ? toChildDetail(res.data) : null;
        },
        enabled: Boolean(childId),
      });
    },
  };
}
