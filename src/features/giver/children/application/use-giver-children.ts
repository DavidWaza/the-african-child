import { useMemo, useState } from "react";
import { sortChildren, type ChildrenSort } from "../domain/giver-children";
import type { GiverChildrenQueryPort } from "../ports/giver-children.port";

export interface GiverChildrenDeps {
  queryPort: GiverChildrenQueryPort;
}

export function useGiverChildrenListApp({ deps }: { deps: GiverChildrenDeps }) {
  const query = deps.queryPort.useChildrenQuery();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<ChildrenSort>("name");

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const all = query.data ?? [];
    const filtered = q ? all.filter((c) => `${c.fullName} ${c.schoolName} ${c.state}`.toLowerCase().includes(q)) : all;
    return sortChildren(filtered, sort);
  }, [query.data, search, sort]);

  return {
    rows,
    total: query.data?.length ?? 0,
    search,
    setSearch,
    sort,
    setSort,
    isLoading: query.isLoading,
  };
}

export function useGiverChildDetailApp({ deps, id }: { deps: GiverChildrenDeps; id: string }) {
  const query = deps.queryPort.useChildQuery({ id: () => id });
  return {
    detail: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    notFound: query.isError || (query.isSuccess && !query.data),
  };
}
