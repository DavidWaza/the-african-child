import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readData, unwrapApiResponse } from "@/lib/http/envelope";
import { toSchool } from "@/lib/transformers";
import { formToApi } from "../domain/admin-schools";
import { adminSchoolsKeys } from "../infrastructure/query-keys";
import type { AdminSchoolsQueryPort, AdminSchoolsServicePort } from "../ports/admin-schools.port";

export default function useAdminSchoolsQueryAdapter(deps: AdminSchoolsServicePort): AdminSchoolsQueryPort {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: adminSchoolsKeys.area });

  return {
    useSchoolsQuery: ({ search }) => {
      const q = search();
      return useQuery({
        queryKey: adminSchoolsKeys.list(q),
        queryFn: async () => readData(await deps.list(q), []).map(toSchool),
        placeholderData: keepPreviousData,
      });
    },
    useSaveSchoolMutation: () =>
      useMutation({
        mutationFn: async ({ id, values }) => {
          const body = formToApi(values);
          const res = id ? await deps.update(id, body) : await deps.create(body);
          return toSchool(unwrapApiResponse(res, "We couldn't save this school.").data);
        },
        onSuccess: invalidate,
      }),
    useDeleteSchoolMutation: () =>
      useMutation({
        mutationFn: async (id) => {
          unwrapApiResponse(await deps.remove(id), "We couldn't remove this school.");
        },
        onSuccess: invalidate,
      }),
  };
}
