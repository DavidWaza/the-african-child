"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ROLE_ROUTE_MAP } from "@/lib/routing";
import { setSession, useSession } from "@/stores/session-store";

/** App-level: clears the session and every cached query, then returns to that role's sign-in. */
export function useSignOut() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const session = useSession();
  return () => {
    const login = session ? ROLE_ROUTE_MAP[session.user.role].loginPath : "/auth/login";
    setSession(null);
    queryClient.clear();
    router.replace(login);
  };
}
