import type { ApiContribution, ApiGiverRow } from "@/lib/api-types";
import { buildSearchParams } from "@/lib/http/envelope";
import { api } from "@/lib/http/transport";
import type { AdminGiversServicePort } from "../../ports/admin-givers.port";

export default function useAdminGiversServiceAdapter(): AdminGiversServicePort {
  return {
    list: () => api.get<ApiGiverRow[]>("/admin/givers"),
    contributions: (giverId) => api.get<ApiContribution[]>(`/admin/contributions${buildSearchParams({ giver_id: giverId })}`),
  };
}
