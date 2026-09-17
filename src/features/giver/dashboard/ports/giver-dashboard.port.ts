import type { UseQueryResult } from "@tanstack/react-query";
import type { ApiChild, ApiGiverOverview } from "@/lib/api-types";
import type { Child } from "@/lib/dto";
import type { ApiResponse } from "@/lib/http/envelope";
import type { GiverOverview } from "../domain/giver-dashboard";

export interface GiverDashboardServicePort {
  getOverview(): Promise<ApiResponse<ApiGiverOverview> | undefined>;
  getChildren(): Promise<ApiResponse<ApiChild[]> | undefined>;
}

export interface GiverDashboardQueryPort {
  useOverviewQuery(): UseQueryResult<GiverOverview | null, Error>;
  useChildrenQuery(): UseQueryResult<Child[], Error>;
}
