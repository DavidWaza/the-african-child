"use client";

import * as React from "react";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { handleApiError, normalizeApiError } from "@/lib/http/errors";
import { setSession } from "@/stores/session-store";

function onUnauthorized(error: unknown) {
  if (normalizeApiError(error).status !== 401) return;
  setSession(null);
  const area = window.location.pathname.startsWith("/admin") ? "/admin/auth/login" : "/auth/login";
  window.location.assign(`${area}?next=${encodeURIComponent(window.location.pathname)}`);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            onUnauthorized(error);
            handleApiError(error);
          },
        }),
        mutationCache: new MutationCache({ onError: onUnauthorized }),
        defaultOptions: {
          // A remount does NOT refetch inside this window — invalidate after mutations.
          queries: { staleTime: 5 * 60_000, gcTime: 5 * 60_000, retry: 0, refetchOnWindowFocus: true },
          mutations: { retry: 0 },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster position="top-right" richColors closeButton toastOptions={{ style: { fontFamily: "var(--font-sans)" } }} />
    </QueryClientProvider>
  );
}
