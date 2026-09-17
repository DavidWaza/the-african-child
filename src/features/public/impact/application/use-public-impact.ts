import type { PublicImpactQueryPort } from "../ports/public-impact.port";

export interface PublicImpactDeps {
  queryPort: PublicImpactQueryPort;
}

export function usePublicImpactApp({ deps }: { deps: PublicImpactDeps }) {
  const query = deps.queryPort.useImpactQuery();
  const impact = query.data ?? null;
  const maxCategory = Math.max(1, ...(impact?.byCategory.map((c) => c.amount) ?? [0]));
  return { impact, maxCategory, isLoading: query.isLoading };
}
