import type { RequestFilters } from "@/lib/http/envelope";

export const adminChildrenKeys = {
  /** Writes invalidate the whole admin area: the dashboard, schools and results all count children. */
  area: ["admin"] as const,
  root: ["admin", "children"] as const,
  list: (filters: RequestFilters) => [...adminChildrenKeys.root, "list", filters] as const,
  detail: (id: string) => [...adminChildrenKeys.root, "detail", id] as const,
  schoolOptions: () => [...adminChildrenKeys.root, "school-options"] as const,
  giverOptions: () => [...adminChildrenKeys.root, "giver-options"] as const,
};
