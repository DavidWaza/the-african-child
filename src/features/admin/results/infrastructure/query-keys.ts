import type { RequestFilters } from "@/lib/http/envelope";

export const adminResultsKeys = {
  area: ["admin"] as const,
  root: ["admin", "results"] as const,
  list: (filters: RequestFilters) => [...adminResultsKeys.root, "list", filters] as const,
  childOptions: () => [...adminResultsKeys.root, "child-options"] as const,
};
