/** Hung off the `admin` root: any admin mutation invalidates this overview by prefix. */
export const adminDashboardKeys = {
  root: ["admin", "dashboard"] as const,
  overview: () => [...adminDashboardKeys.root, "overview"] as const,
};
