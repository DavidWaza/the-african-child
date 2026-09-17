import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readData, unwrapApiResponse } from "@/lib/http/envelope";
import { toChild, toChildDetail } from "@/lib/transformers";
import { formToApi } from "../domain/admin-children";
import { adminChildrenKeys } from "../infrastructure/query-keys";
import type { AdminChildrenQueryPort, AdminChildrenServicePort } from "../ports/admin-children.port";

export default function useAdminChildrenQueryAdapter(deps: AdminChildrenServicePort): AdminChildrenQueryPort {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: adminChildrenKeys.area });

  return {
    useChildrenQuery: ({ filters }) => {
      const f = filters();
      return useQuery({
        queryKey: adminChildrenKeys.list(f),
        queryFn: async () => {
          const res = await deps.list(f);
          return { rows: readData(res, []).map(toChild), meta: res?.status ? res.meta : undefined };
        },
        // Without this the table empties and the card jumps on every page / filter change.
        placeholderData: keepPreviousData,
      });
    },
    useChildQuery: ({ id }) => {
      const childId = id();
      return useQuery({
        queryKey: adminChildrenKeys.detail(childId ?? ""),
        queryFn: async () => {
          const res = await deps.detail(childId!);
          return res?.status && res.data ? toChildDetail(res.data) : null;
        },
        enabled: Boolean(childId),
      });
    },
    useSchoolOptionsQuery: () =>
      useQuery({
        queryKey: adminChildrenKeys.schoolOptions(),
        queryFn: async () => readData(await deps.schools(), []).map((s) => ({ id: s.id, name: s.name, state: s.state })),
      }),
    useGiverOptionsQuery: () =>
      useQuery({
        queryKey: adminChildrenKeys.giverOptions(),
        queryFn: async () =>
          readData(await deps.givers(), []).map((g) => ({
            id: g.id,
            fullName: g.full_name,
            email: g.email,
            childrenCount: g.children_count,
          })),
      }),
    useSaveChildMutation: () =>
      useMutation({
        mutationFn: async ({ id, values }) => {
          const body = formToApi(values);
          const res = id ? await deps.update(id, body) : await deps.create(body);
          return toChild(unwrapApiResponse(res, "We couldn't save this child's record.").data);
        },
        onSuccess: invalidate,
      }),
    useDeleteChildMutation: () =>
      useMutation({
        mutationFn: async (id) => {
          unwrapApiResponse(await deps.remove(id), "We couldn't delete this record.");
        },
        onSuccess: (_, id) => {
          // The open detail screen must not refetch a record that no longer exists.
          const detailKey = adminChildrenKeys.detail(id);
          queryClient.removeQueries({ queryKey: detailKey, exact: true });
          return queryClient.invalidateQueries({
            queryKey: adminChildrenKeys.area,
            predicate: (q) => JSON.stringify(q.queryKey) !== JSON.stringify(detailKey),
          });
        },
      }),
    useAddDisbursementMutation: () =>
      useMutation({
        mutationFn: async ({ childId, values }) => {
          unwrapApiResponse(
            await deps.addDisbursement(childId, {
              category: values.category,
              amount: values.amount,
              spent_on: values.spentOn,
              note: values.note || null,
            }),
            "We couldn't record this spend.",
          );
        },
        onSuccess: invalidate,
      }),
    useDeleteDisbursementMutation: () =>
      useMutation({
        mutationFn: async (id) => {
          unwrapApiResponse(await deps.removeDisbursement(id), "We couldn't remove this spend.");
        },
        onSuccess: invalidate,
      }),
    useDeleteResultMutation: () =>
      useMutation({
        mutationFn: async (id) => {
          unwrapApiResponse(await deps.removeResult(id), "We couldn't delete this result.");
        },
        onSuccess: invalidate,
      }),
  };
}
