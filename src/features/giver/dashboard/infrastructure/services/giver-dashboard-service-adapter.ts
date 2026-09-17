import type { ApiChild, ApiGiverOverview } from "@/lib/api-types";
import { api } from "@/lib/http/transport";
import type { GiverDashboardServicePort } from "../../ports/giver-dashboard.port";

export default function useGiverDashboardServiceAdapter(): GiverDashboardServicePort {
  return {
    getOverview: () => api.get<ApiGiverOverview>("/giver/overview"),
    getChildren: () => api.get<ApiChild[]>("/giver/children"),
  };
}
