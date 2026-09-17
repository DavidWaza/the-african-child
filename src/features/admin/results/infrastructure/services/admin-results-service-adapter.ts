import type { ApiChild, ApiResult } from "@/lib/api-types";
import { buildSearchParams } from "@/lib/http/envelope";
import { api } from "@/lib/http/transport";
import type { AdminResultsServicePort } from "../../ports/admin-results.port";

export default function useAdminResultsServiceAdapter(): AdminResultsServicePort {
  return {
    list: (filters) => api.get<ApiResult[]>(`/admin/results${buildSearchParams(filters)}`),
    upload: (body) => api.post<ApiResult>("/admin/results", body),
    remove: (id) => api.delete<null>(`/admin/results/${encodeURIComponent(id)}`),
    children: () => api.get<ApiChild[]>(`/admin/children${buildSearchParams({ all: true })}`),
  };
}
