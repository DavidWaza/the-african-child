import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { ApiChild, ApiChildDetail, ApiDisbursement, ApiGiverRow, ApiSchool } from "@/lib/api-types";
import type { Child, ChildDetail } from "@/lib/dto";
import type { ApiResponse, PaginationMeta, RequestFilters } from "@/lib/http/envelope";
import type { ChildFormValues, DisbursementFormOutput, GiverOption, SchoolOption } from "../domain/admin-children";

export interface AdminChildrenServicePort {
  list(filters: RequestFilters): Promise<ApiResponse<ApiChild[]> | undefined>;
  detail(id: string): Promise<ApiResponse<ApiChildDetail> | undefined>;
  create(body: Partial<ApiChild>): Promise<ApiResponse<ApiChild> | undefined>;
  update(id: string, body: Partial<ApiChild>): Promise<ApiResponse<ApiChild> | undefined>;
  remove(id: string): Promise<ApiResponse<null> | undefined>;
  addDisbursement(childId: string, body: Record<string, unknown>): Promise<ApiResponse<ApiDisbursement> | undefined>;
  removeDisbursement(id: string): Promise<ApiResponse<null> | undefined>;
  removeResult(id: string): Promise<ApiResponse<null> | undefined>;
  schools(): Promise<ApiResponse<ApiSchool[]> | undefined>;
  givers(): Promise<ApiResponse<ApiGiverRow[]> | undefined>;
}

export interface ChildrenPage {
  rows: Child[];
  meta: PaginationMeta | undefined;
}

export interface AdminChildrenQueryPort {
  useChildrenQuery(options: { filters: () => RequestFilters }): UseQueryResult<ChildrenPage, Error>;
  useChildQuery(options: { id: () => string | null }): UseQueryResult<ChildDetail | null, Error>;
  useSchoolOptionsQuery(): UseQueryResult<SchoolOption[], Error>;
  useGiverOptionsQuery(): UseQueryResult<GiverOption[], Error>;
  useSaveChildMutation(): UseMutationResult<Child, Error, { id?: string; values: ChildFormValues }>;
  useDeleteChildMutation(): UseMutationResult<void, Error, string>;
  useAddDisbursementMutation(): UseMutationResult<void, Error, { childId: string; values: DisbursementFormOutput }>;
  useDeleteDisbursementMutation(): UseMutationResult<void, Error, string>;
  useDeleteResultMutation(): UseMutationResult<void, Error, string>;
}
