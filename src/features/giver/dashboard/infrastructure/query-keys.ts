/** Slice-owned keys, hung off the `giver` root so pledge changes can invalidate by prefix. */
export const giverDashboardKeys = {
  root: ["giver", "dashboard"] as const,
  overview: () => [...giverDashboardKeys.root, "overview"] as const,
  children: () => [...giverDashboardKeys.root, "children"] as const,
};
