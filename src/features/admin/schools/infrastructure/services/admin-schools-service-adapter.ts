import type { ApiSchool } from "@/lib/api-types";
import { buildSearchParams } from "@/lib/http/envelope";
import { api } from "@/lib/http/transport";
import type { AdminSchoolsServicePort } from "../../ports/admin-schools.port";

export default function useAdminSchoolsServiceAdapter(): AdminSchoolsServicePort {
  return {
    list: (search) => api.get<ApiSchool[]>(`/admin/schools${buildSearchParams({ search })}`),
    create: (body) => api.post<ApiSchool>("/admin/schools", body),
    update: (id, body) => api.put<ApiSchool>(`/admin/schools/${encodeURIComponent(id)}`, body),
    remove: (id) => api.delete<null>(`/admin/schools/${encodeURIComponent(id)}`),
  };
}
