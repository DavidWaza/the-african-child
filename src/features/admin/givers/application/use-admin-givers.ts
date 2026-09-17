import { useMemo, useState } from "react";
import { filterGivers, giverTotals, type GiverRow } from "../domain/admin-givers";
import type { AdminGiversQueryPort } from "../ports/admin-givers.port";

export interface AdminGiversDeps {
  queryPort: AdminGiversQueryPort;
}

export function useAdminGiversApp({ deps }: { deps: AdminGiversDeps }) {
  const query = deps.queryPort.useGiversQuery();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<GiverRow | null>(null);
  const history = deps.queryPort.useContributionsQuery({ giverId: () => selected?.id ?? null });

  const all = useMemo(() => query.data ?? [], [query.data]);

  return {
    rows: useMemo(() => filterGivers(all, search), [all, search]),
    totals: useMemo(() => giverTotals(all), [all]),
    isLoading: query.isLoading,
    search,
    setSearch,
    selected,
    select: setSelected,
    history: history.data ?? [],
    historyLoading: history.isLoading,
  };
}
