import { useMemo, useState } from "react";
import { DEFAULT_PAGINATION, type RequestFilters } from "@/lib/http/envelope";
import {
  CHILD_STATUS_FILTERS,
  childToForm,
  type ChildFormValues,
  type ChildStatusFilter,
  type DisbursementFormOutput,
} from "../domain/admin-children";
import type { AdminChildrenQueryPort } from "../ports/admin-children.port";

export interface AdminChildrenDeps {
  queryPort: AdminChildrenQueryPort;
  notify: { success: (message: string) => void; error: (error: unknown) => void };
  navigate: { toDetail: (id: string) => void; toList: () => void };
}

export function useAdminChildrenListApp({
  deps,
  initialStatus = "",
  initialSchoolId = "",
}: {
  deps: AdminChildrenDeps;
  initialStatus?: string;
  initialSchoolId?: string;
}) {
  const [status, setStatus] = useState<ChildStatusFilter>(
    (CHILD_STATUS_FILTERS.find((f) => f.value === initialStatus)?.value ?? "") as ChildStatusFilter,
  );
  const [schoolId, setSchoolId] = useState(initialSchoolId);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState<number>(DEFAULT_PAGINATION.page);

  const filters = useMemo<RequestFilters>(
    () => ({ status, school_id: schoolId, search, page, limit: DEFAULT_PAGINATION.limit }),
    [status, schoolId, search, page],
  );

  const query = deps.queryPort.useChildrenQuery({ filters: () => filters });
  const schools = deps.queryPort.useSchoolOptionsQuery();

  return {
    rows: query.data?.rows ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isPlaceholder: query.isPlaceholderData,
    schools: schools.data ?? [],
    status,
    schoolId,
    search,
    onStatus: (s: ChildStatusFilter) => {
      setStatus(s);
      setPage(1);
    },
    onSchool: (id: string) => {
      setSchoolId(id);
      setPage(1);
    },
    onSearch: (q: string) => {
      setSearch(q);
      setPage(1);
    },
    setPage,
    hasFilters: Boolean(status || schoolId || search),
  };
}

export function useAdminChildFormApp({ deps, id }: { deps: AdminChildrenDeps; id: string | null }) {
  const detail = deps.queryPort.useChildQuery({ id: () => id });
  const schools = deps.queryPort.useSchoolOptionsQuery();
  const givers = deps.queryPort.useGiverOptionsQuery();
  const save = deps.queryPort.useSaveChildMutation();

  return {
    child: detail.data?.child ?? null,
    isLoadingChild: Boolean(id) && detail.isLoading,
    schools: schools.data ?? [],
    schoolsLoading: schools.isLoading,
    givers: givers.data ?? [],
    submit: (values: ChildFormValues) =>
      save.mutate(
        { id: id ?? undefined, values },
        {
          onSuccess: (child) => {
            deps.notify.success(id ? `${child.firstName}'s record was updated.` : `${child.firstName} was added to the programme.`);
            deps.navigate.toDetail(child.id);
          },
        },
      ),
    isSaving: save.isPending,
    error: save.error?.message ?? null,
  };
}

export function useAdminChildDetailApp({ deps, id }: { deps: AdminChildrenDeps; id: string }) {
  const remove = deps.queryPort.useDeleteChildMutation();
  // Once deleted, stop observing the record so nothing refetches it.
  const detail = deps.queryPort.useChildQuery({ id: () => (remove.isSuccess ? null : id) });
  const givers = deps.queryPort.useGiverOptionsQuery();
  const save = deps.queryPort.useSaveChildMutation();
  const addSpend = deps.queryPort.useAddDisbursementMutation();
  const removeSpend = deps.queryPort.useDeleteDisbursementMutation();
  const removeResult = deps.queryPort.useDeleteResultMutation();

  const data = detail.data ?? null;

  return {
    detail: data,
    isLoading: detail.isLoading,
    notFound: !remove.isSuccess && (detail.isError || (detail.isSuccess && !data)),
    givers: givers.data ?? [],

    deleteChild: () =>
      remove.mutate(id, {
        onSuccess: () => {
          deps.notify.success("The record was deleted.");
          deps.navigate.toList();
        },
        onError: deps.notify.error,
      }),
    isDeleting: remove.isPending || remove.isSuccess,

    setSponsors: (sponsorIds: string[], onDone?: () => void) => {
      if (!data) return;
      const { child } = data;
      save.mutate(
        {
          id,
          values: {
            ...childToForm(child),
            // Matching a waiting child activates them.
            status: child.status === "pending_review" && sponsorIds.length ? "active" : childToForm(child).status,
            sponsorIds,
          },
        },
        {
          onSuccess: () => {
            deps.notify.success("Sponsors updated. They can now see this child on their dashboard.");
            onDone?.();
          },
          onError: deps.notify.error,
        },
      );
    },
    isSavingSponsors: save.isPending,

    addDisbursement: (values: DisbursementFormOutput, onDone?: () => void) =>
      addSpend.mutate(
        { childId: id, values },
        {
          onSuccess: () => {
            deps.notify.success("Spend recorded. Sponsors can see it now.");
            onDone?.();
          },
        },
      ),
    isAddingSpend: addSpend.isPending,
    spendError: addSpend.error?.message ?? null,
    resetSpend: addSpend.reset,

    deleteDisbursement: (disbursementId: string) =>
      removeSpend.mutate(disbursementId, { onSuccess: () => deps.notify.success("Spend removed."), onError: deps.notify.error }),
    deleteResult: (resultId: string) =>
      removeResult.mutate(resultId, { onSuccess: () => deps.notify.success("Result deleted."), onError: deps.notify.error }),
  };
}
