export interface GiverRow {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  monthlyAmount: number | null;
  pledgeStatus: string | null;
  totalContributed: number;
  childrenCount: number;
  joinedAt: string;
}

export function giverTotals(rows: GiverRow[]) {
  const active = rows.filter((r) => r.pledgeStatus === "active");
  return {
    givers: rows.length,
    active: active.length,
    monthly: active.reduce((a, r) => a + (r.monthlyAmount ?? 0), 0),
    lifetime: rows.reduce((a, r) => a + r.totalContributed, 0),
    unmatched: rows.filter((r) => r.childrenCount === 0).length,
  };
}

export function filterGivers(rows: GiverRow[], search: string) {
  const q = search.trim().toLowerCase();
  return q ? rows.filter((r) => `${r.fullName} ${r.email}`.toLowerCase().includes(q)) : rows;
}
