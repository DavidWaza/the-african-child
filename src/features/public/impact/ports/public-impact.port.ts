import type { UseQueryResult } from "@tanstack/react-query";
import type { ApiPublicImpact } from "@/lib/api-types";
import type { ApiResponse } from "@/lib/http/envelope";
import type { PublicImpact } from "../domain/public-impact";

export interface PublicImpactServicePort {
  getImpact(): Promise<ApiResponse<ApiPublicImpact> | undefined>;
}

export interface PublicImpactQueryPort {
  useImpactQuery(): UseQueryResult<PublicImpact | null, Error>;
}
