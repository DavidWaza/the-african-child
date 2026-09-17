export const giverPledgesKeys = {
  /** Mutations here invalidate the whole `giver` prefix — the dashboard reads these totals too. */
  area: ["giver"] as const,
  root: ["giver", "pledges"] as const,
  pledge: () => [...giverPledgesKeys.root, "pledge"] as const,
  contributions: () => [...giverPledgesKeys.root, "contributions"] as const,
};
