export const adminSchoolsKeys = {
  area: ["admin"] as const,
  root: ["admin", "schools"] as const,
  list: (search: string) => [...adminSchoolsKeys.root, "list", search] as const,
};
