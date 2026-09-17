import type { ApiChild, ApiChildDetail, ApiDisbursement, ApiGiverRow, ApiSchool } from "@/lib/api-types";
import { buildSearchParams } from "@/lib/http/envelope";
import { api } from "@/lib/http/transport";
import type { AdminChildrenServicePort } from "../../ports/admin-children.port";

export default function useAdminChildrenServiceAdapter(): AdminChildrenServicePort {
  const id = encodeURIComponent;
  return {
    list: (filters) => api.get<ApiChild[]>(`/admin/children${buildSearchParams(filters)}`),
    detail: (childId) => api.get<ApiChildDetail>(`/admin/children/${id(childId)}`),
    create: (body) => api.post<ApiChild>("/admin/children", body),
    update: (childId, body) => api.put<ApiChild>(`/admin/children/${id(childId)}`, body),
    remove: (childId) => api.delete<null>(`/admin/children/${id(childId)}`),
    addDisbursement: (childId, body) => api.post<ApiDisbursement>(`/admin/children/${id(childId)}/disbursements`, body),
    removeDisbursement: (dId) => api.delete<null>(`/admin/disbursements/${id(dId)}`),
    removeResult: (rId) => api.delete<null>(`/admin/results/${id(rId)}`),
    schools: () => api.get<ApiSchool[]>("/admin/schools"),
    givers: () => api.get<ApiGiverRow[]>("/admin/givers"),
  };
}
