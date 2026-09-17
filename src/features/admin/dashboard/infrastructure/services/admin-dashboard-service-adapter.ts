import type { ApiAdminOverview } from "@/lib/api-types";
import { api } from "@/lib/http/transport";
import type { AdminDashboardServicePort } from "../../ports/admin-dashboard.port";

export default function useAdminDashboardServiceAdapter(): AdminDashboardServicePort {
  return {
    getOverview: () => api.get<ApiAdminOverview>("/admin/overview"),
  };
}
