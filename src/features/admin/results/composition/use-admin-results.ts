"use client";

import { toast } from "sonner";
import { toastError } from "@/lib/http/errors";
import useAdminResultsQueryAdapter from "../adapters/admin-results-query-adapter";
import { useAdminResultsApp, type AdminResultsDeps } from "../application/use-admin-results";
import useAdminResultsServiceAdapter from "../infrastructure/services/admin-results-service-adapter";

export function useAdminResultsDeps(): AdminResultsDeps {
  return {
    queryPort: useAdminResultsQueryAdapter(useAdminResultsServiceAdapter()),
    notify: { success: (m) => toast.success(m), error: toastError },
  };
}

export function useAdminResults(options: { initialUpload?: boolean; initialChildId?: string } = {}) {
  return useAdminResultsApp({ deps: useAdminResultsDeps(), ...options });
}
