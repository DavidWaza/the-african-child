export const giverChildrenKeys = {
  root: ["giver", "children"] as const,
  list: () => [...giverChildrenKeys.root, "list"] as const,
  detail: (id: string) => [...giverChildrenKeys.root, "detail", id] as const,
};
