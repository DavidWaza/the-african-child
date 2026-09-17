export const adminGiversKeys = {
  root: ["admin", "givers"] as const,
  list: () => [...adminGiversKeys.root, "list"] as const,
  contributions: (giverId: string) => [...adminGiversKeys.root, "contributions", giverId] as const,
};
