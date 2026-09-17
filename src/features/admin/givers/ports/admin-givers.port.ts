import type { UseQueryResult } from "@tanstack/react-query";
import type { ApiContribution, ApiGiverRow } from "@/lib/api-types";
import type { Contribution } from "@/lib/dto";
import type { ApiResponse } from "@/lib/http/envelope";
import type { GiverRow } from "../domain/admin-givers";

export interface AdminGiversServicePort {
  list(): Promise<ApiResponse<ApiGiverRow[]> | undefined>;
  contributions(giverId: string): Promise<ApiResponse<ApiContribution[]> | undefined>;
}

export interface AdminGiversQueryPort {
  useGiversQuery(): UseQueryResult<GiverRow[], Error>;
  useContributionsQuery(options: { giverId: () => string | null }): UseQueryResult<Contribution[], Error>;
}
