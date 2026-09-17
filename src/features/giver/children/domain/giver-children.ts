import type { Child } from "@/lib/dto";

export const GIVER_CHILDREN_ROUTES = {
  list: "/giver/children",
  detail: (id: string) => `/giver/children/${id}`,
} as const;

export type ChildrenSort = "name" | "performance" | "class";

export const CHILDREN_SORTS: { value: ChildrenSort; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "performance", label: "Performance" },
  { value: "class", label: "Class" },
];

export function sortChildren(children: Child[], sort: ChildrenSort): Child[] {
  const copy = [...children];
  if (sort === "performance") return copy.sort((a, b) => (b.latestAverage ?? -1) - (a.latestAverage ?? -1));
  if (sort === "class") return copy.sort((a, b) => a.classLevel.localeCompare(b.classLevel));
  return copy.sort((a, b) => a.fullName.localeCompare(b.fullName));
}
