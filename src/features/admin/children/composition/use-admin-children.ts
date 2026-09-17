"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toastError } from "@/lib/http/errors";
import useAdminChildrenQueryAdapter from "../adapters/admin-children-query-adapter";
import {
  useAdminChildDetailApp,
  useAdminChildFormApp,
  useAdminChildrenListApp,
  type AdminChildrenDeps,
} from "../application/use-admin-children";
import { ADMIN_CHILDREN_ROUTES } from "../domain/admin-children";
import useAdminChildrenServiceAdapter from "../infrastructure/services/admin-children-service-adapter";

export function useAdminChildrenDeps(): AdminChildrenDeps {
  const router = useRouter();
  return {
    queryPort: useAdminChildrenQueryAdapter(useAdminChildrenServiceAdapter()),
    notify: { success: (m) => toast.success(m), error: toastError },
    navigate: {
      toDetail: (id) => router.push(ADMIN_CHILDREN_ROUTES.detail(id)),
      toList: () => router.replace(ADMIN_CHILDREN_ROUTES.list),
    },
  };
}

export function useAdminChildren(options: { initialStatus?: string; initialSchoolId?: string } = {}) {
  return useAdminChildrenListApp({ deps: useAdminChildrenDeps(), ...options });
}

export function useAdminChildForm(id: string | null) {
  return useAdminChildFormApp({ deps: useAdminChildrenDeps(), id });
}

export function useAdminChild(id: string) {
  return useAdminChildDetailApp({ deps: useAdminChildrenDeps(), id });
}
