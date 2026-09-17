import type { ApiPublicImpact } from "@/lib/api-types";
import { api } from "@/lib/http/transport";
import type { PublicImpactServicePort } from "../../ports/public-impact.port";

export default function usePublicImpactServiceAdapter(): PublicImpactServicePort {
  return { getImpact: () => api.get<ApiPublicImpact>("/public/impact") };
}
