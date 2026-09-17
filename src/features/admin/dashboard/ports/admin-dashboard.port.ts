import type { UseQueryResult } from "@tanstack/react-query";
import type { ApiAdminOverview } from "@/lib/api-types";
import type { ApiResponse } from "@/lib/http/envelope";
import type { AdminOverview } from "../domain/admin-dashboard";

export interface AdminDashboardServicePort {
  getOverview(): Promise<ApiResponse<ApiAdminOverview> | undefined>;
}

export interface AdminDashboardQueryPort {
  useOverviewQuery(): UseQueryResult<AdminOverview | null, Error>;
}
