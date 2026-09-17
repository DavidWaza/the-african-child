import type { UseQueryResult } from "@tanstack/react-query";
import type { ApiChild, ApiChildDetail } from "@/lib/api-types";
import type { Child, ChildDetail } from "@/lib/dto";
import type { ApiResponse } from "@/lib/http/envelope";

export interface GiverChildrenServicePort {
  list(): Promise<ApiResponse<ApiChild[]> | undefined>;
  detail(id: string): Promise<ApiResponse<ApiChildDetail> | undefined>;
}

export interface GiverChildrenQueryPort {
  useChildrenQuery(): UseQueryResult<Child[], Error>;
  useChildQuery(options: { id: () => string }): UseQueryResult<ChildDetail | null, Error>;
}
