import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readData, unwrapApiResponse } from "@/lib/http/envelope";
import { toTermResult } from "@/lib/transformers";
import { formToApi } from "../domain/admin-results";
import { adminResultsKeys } from "../infrastructure/query-keys";
import type { AdminResultsQueryPort, AdminResultsServicePort } from "../ports/admin-results.port";

export default function useAdminResultsQueryAdapter(deps: AdminResultsServicePort): AdminResultsQueryPort {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: adminResultsKeys.area });

  return {
    useResultsQuery: ({ filters }) => {
      const f = filters();
      return useQuery({
        queryKey: adminResultsKeys.list(f),
        queryFn: async () => {
          const res = await deps.list(f);
          return { rows: readData(res, []).map(toTermResult), meta: res?.status ? res.meta : undefined };
        },
        placeholderData: keepPreviousData,
      });
    },
    useChildOptionsQuery: () =>
      useQuery({
        queryKey: adminResultsKeys.childOptions(),
        queryFn: async () =>
          readData(await deps.children(), [])
            .filter((c) => c.status !== "withdrawn")
            .map((c) => ({
              id: c.id,
              fullName: `${c.first_name} ${c.last_name}`,
              classLevel: c.class_level,
              schoolName: c.school_name,
            })),
      }),
    useUploadMutation: () =>
      useMutation({
        mutationFn: async ({ values, attachment }) =>
          toTermResult(unwrapApiResponse(await deps.upload(formToApi(values, attachment)), "We couldn't upload these results.").data),
        onSuccess: invalidate,
      }),
    useDeleteMutation: () =>
      useMutation({
        mutationFn: async (id) => {
          unwrapApiResponse(await deps.remove(id), "We couldn't delete this result.");
        },
        onSuccess: invalidate,
      }),
  };
}
