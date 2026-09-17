"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { ROLE_ROUTE_MAP } from "@/lib/routing";
import { setSession } from "@/stores/session-store";
import useAuthMutationAdapter from "../adapters/auth-mutation-adapter";
import type { AuthDeps } from "../application/use-auth";
import useAuthServiceAdapter from "../infrastructure/services/auth-service-adapter";

/** The only place adapters are named. */
export default function useAuthDeps(): AuthDeps {
  const router = useRouter();
  const search = useSearchParams();
  const queryClient = useQueryClient();
  return {
    mutationPort: useAuthMutationAdapter(useAuthServiceAdapter()),
    onAuthenticated: (session) => {
      queryClient.clear();
      setSession(session);
      const home = ROLE_ROUTE_MAP[session.user.role];
      const next = search.get("next");
      const safeNext = next && next.startsWith(home.home) && !next.startsWith("//") ? next : home.home;
      router.replace(safeNext);
      router.refresh();
    },
  };
}
