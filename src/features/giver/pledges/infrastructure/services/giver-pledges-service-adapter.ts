import type { ApiContribution, ApiPledge } from "@/lib/api-types";
import { api } from "@/lib/http/transport";
import type { GiverPledgesServicePort } from "../../ports/giver-pledges.port";

export default function useGiverPledgesServiceAdapter(): GiverPledgesServicePort {
  return {
    getPledge: () => api.get<ApiPledge | null>("/giver/pledge"),
    updatePledge: (input) => api.put<ApiPledge>("/giver/pledge", input),
    listContributions: () => api.get<ApiContribution[]>("/giver/contributions"),
    contribute: (input) => api.post<ApiContribution>("/giver/contributions", input),
  };
}
