import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { ApiAttachment, ApiChild, ApiResult } from "@/lib/api-types";
import type { TermResult } from "@/lib/dto";
import type { ApiResponse, PaginationMeta, RequestFilters } from "@/lib/http/envelope";
import type { ChildOption, ResultFormOutput } from "../domain/admin-results";

export interface AdminResultsServicePort {
  list(filters: RequestFilters): Promise<ApiResponse<ApiResult[]> | undefined>;
  upload(body: Record<string, unknown>): Promise<ApiResponse<ApiResult> | undefined>;
  remove(id: string): Promise<ApiResponse<null> | undefined>;
  children(): Promise<ApiResponse<ApiChild[]> | undefined>;
}

export interface AdminResultsQueryPort {
  useResultsQuery(options: { filters: () => RequestFilters }): UseQueryResult<{ rows: TermResult[]; meta?: PaginationMeta }, Error>;
  useChildOptionsQuery(): UseQueryResult<ChildOption[], Error>;
  useUploadMutation(): UseMutationResult<TermResult, Error, { values: ResultFormOutput; attachment: ApiAttachment | null }>;
  useDeleteMutation(): UseMutationResult<void, Error, string>;
}
