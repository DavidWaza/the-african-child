"use client";

import useAdminGiversQueryAdapter from "../adapters/admin-givers-query-adapter";
import { useAdminGiversApp, type AdminGiversDeps } from "../application/use-admin-givers";
import useAdminGiversServiceAdapter from "../infrastructure/services/admin-givers-service-adapter";

export function useAdminGiversDeps(): AdminGiversDeps {
  return { queryPort: useAdminGiversQueryAdapter(useAdminGiversServiceAdapter()) };
}

export function useAdminGivers() {
  return useAdminGiversApp({ deps: useAdminGiversDeps() });
}
