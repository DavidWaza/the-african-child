import { useMemo, useState } from "react";
import type { ApiAttachment } from "@/lib/api-types";
import type { TermResult } from "@/lib/dto";
import { DEFAULT_PAGINATION, type RequestFilters } from "@/lib/http/envelope";
import type { ResultFormOutput } from "../domain/admin-results";
import type { AdminResultsQueryPort } from "../ports/admin-results.port";

export interface AdminResultsDeps {
  queryPort: AdminResultsQueryPort;
  notify: { success: (message: string) => void; error: (error: unknown) => void };
}

export function useAdminResultsApp({
  deps,
  initialUpload = false,
  initialChildId = "",
}: {
  deps: AdminResultsDeps;
  initialUpload?: boolean;
  initialChildId?: string;
}) {
  const [session, setSession] = useState("");
  const [term, setTerm] = useState("");
  const [childId, setChildId] = useState("");
  const [page, setPage] = useState<number>(DEFAULT_PAGINATION.page);
  const [uploadOpen, setUploadOpen] = useState(initialUpload);
  const [uploadChildId, setUploadChildId] = useState(initialChildId);
  const [viewing, setViewing] = useState<TermResult | null>(null);

  const filters = useMemo<RequestFilters>(
    () => ({ session, term, child_id: childId, page, limit: DEFAULT_PAGINATION.limit }),
    [session, term, childId, page],
  );
  const query = deps.queryPort.useResultsQuery({ filters: () => filters });
  const children = deps.queryPort.useChildOptionsQuery();
  const upload = deps.queryPort.useUploadMutation();
  const remove = deps.queryPort.useDeleteMutation();

  const withReset =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      set(v);
      setPage(1);
    };

  return {
    rows: query.data?.rows ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isPlaceholder: query.isPlaceholderData,
    setPage,
    filters: { session, term, childId },
    setSessionFilter: withReset(setSession),
    setTermFilter: withReset(setTerm),
    setChildFilter: withReset(setChildId),
    hasFilters: Boolean(session || term || childId),

    children: children.data ?? [],
    childrenLoading: children.isLoading,

    uploadOpen,
    uploadChildId,
    openUpload: (forChildId = "") => {
      upload.reset();
      setUploadChildId(forChildId);
      setUploadOpen(true);
    },
    closeUpload: () => setUploadOpen(false),
    submitUpload: (values: ResultFormOutput, attachment: ApiAttachment | null) =>
      upload.mutate(
        { values, attachment },
        {
          onSuccess: (r) => {
            deps.notify.success(`${r.childName}'s ${r.termLabel.toLowerCase()} results are live for sponsors.`);
            setUploadOpen(false);
          },
        },
      ),
    isUploading: upload.isPending,
    uploadError: upload.error?.message ?? null,

    viewing,
    view: setViewing,
    remove: (r: TermResult) =>
      remove.mutate(r.id, {
        onSuccess: () => {
          deps.notify.success("Result deleted.");
          setViewing(null);
        },
        onError: deps.notify.error,
      }),
    isRemoving: remove.isPending,
  };
}
