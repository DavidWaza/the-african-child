"use client";

import usePublicImpactQueryAdapter from "../adapters/public-impact-query-adapter";
import { usePublicImpactApp, type PublicImpactDeps } from "../application/use-public-impact";
import usePublicImpactServiceAdapter from "../infrastructure/services/public-impact-service-adapter";

export function usePublicImpactDeps(): PublicImpactDeps {
  return { queryPort: usePublicImpactQueryAdapter(usePublicImpactServiceAdapter()) };
}

export function usePublicImpact() {
  return usePublicImpactApp({ deps: usePublicImpactDeps() });
}
