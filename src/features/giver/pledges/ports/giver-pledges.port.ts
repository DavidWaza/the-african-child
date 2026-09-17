import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { ApiContribution, ApiPledge } from "@/lib/api-types";
import type { Contribution, Pledge } from "@/lib/dto";
import type { ApiResponse } from "@/lib/http/envelope";

export interface GiverPledgesServicePort {
  getPledge(): Promise<ApiResponse<ApiPledge | null> | undefined>;
  updatePledge(input: { monthly_amount: number; status: string }): Promise<ApiResponse<ApiPledge> | undefined>;
  listContributions(): Promise<ApiResponse<ApiContribution[]> | undefined>;
  contribute(input: { month: string; amount: number }): Promise<ApiResponse<ApiContribution> | undefined>;
}

export interface GiverPledgesQueryPort {
  usePledgeQuery(): UseQueryResult<Pledge | null, Error>;
  useContributionsQuery(): UseQueryResult<Contribution[], Error>;
  useUpdatePledgeMutation(): UseMutationResult<Pledge, Error, { monthlyAmount: number; status: string }>;
  useContributeMutation(): UseMutationResult<Contribution, Error, { month: string; amount: number }>;
}
