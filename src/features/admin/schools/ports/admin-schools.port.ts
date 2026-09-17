import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { ApiSchool } from "@/lib/api-types";
import type { School } from "@/lib/dto";
import type { ApiResponse } from "@/lib/http/envelope";
import type { SchoolFormOutput } from "../domain/admin-schools";

export interface AdminSchoolsServicePort {
  list(search: string): Promise<ApiResponse<ApiSchool[]> | undefined>;
  create(body: Record<string, unknown>): Promise<ApiResponse<ApiSchool> | undefined>;
  update(id: string, body: Record<string, unknown>): Promise<ApiResponse<ApiSchool> | undefined>;
  remove(id: string): Promise<ApiResponse<null> | undefined>;
}

export interface AdminSchoolsQueryPort {
  useSchoolsQuery(options: { search: () => string }): UseQueryResult<School[], Error>;
  useSaveSchoolMutation(): UseMutationResult<School, Error, { id?: string; values: SchoolFormOutput }>;
  useDeleteSchoolMutation(): UseMutationResult<void, Error, string>;
}
