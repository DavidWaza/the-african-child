"use client";

import { toast } from "sonner";
import { toastError } from "@/lib/http/errors";
import useAdminSchoolsQueryAdapter from "../adapters/admin-schools-query-adapter";
import { useAdminSchoolsApp, type AdminSchoolsDeps } from "../application/use-admin-schools";
import useAdminSchoolsServiceAdapter from "../infrastructure/services/admin-schools-service-adapter";

export function useAdminSchoolsDeps(): AdminSchoolsDeps {
  return {
    queryPort: useAdminSchoolsQueryAdapter(useAdminSchoolsServiceAdapter()),
    notify: { success: (m) => toast.success(m), error: toastError },
  };
}

export function useAdminSchools() {
  return useAdminSchoolsApp({ deps: useAdminSchoolsDeps() });
}
