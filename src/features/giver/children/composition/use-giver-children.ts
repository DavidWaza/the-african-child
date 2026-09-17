"use client";

import useGiverChildrenQueryAdapter from "../adapters/giver-children-query-adapter";
import { useGiverChildDetailApp, useGiverChildrenListApp, type GiverChildrenDeps } from "../application/use-giver-children";
import useGiverChildrenServiceAdapter from "../infrastructure/services/giver-children-service-adapter";

export function useGiverChildrenDeps(): GiverChildrenDeps {
  return { queryPort: useGiverChildrenQueryAdapter(useGiverChildrenServiceAdapter()) };
}

export function useGiverChildren() {
  return useGiverChildrenListApp({ deps: useGiverChildrenDeps() });
}

export function useGiverChild(id: string) {
  return useGiverChildDetailApp({ deps: useGiverChildrenDeps(), id });
}
