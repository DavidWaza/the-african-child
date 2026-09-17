import { toast } from "sonner";

export type ApiErrorKind = "client" | "server" | "network" | "unknown";

export interface NormalizedApiError {
  kind: ApiErrorKind;
  status?: number;
  message: string;
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (error && typeof error === "object" && "isAxiosError" in error) {
    const e = error as unknown as { response?: { status: number; data?: { message?: string } }; message: string };
    if (!e.response) return { kind: "network", message: "We couldn't reach the server. Check your connection." };
    const status = e.response.status;
    return {
      kind: status >= 500 ? "server" : "client",
      status,
      message: e.response.data?.message ?? e.message,
    };
  }
  if (error instanceof Error) return { kind: "unknown", message: error.message };
  return { kind: "unknown", message: "Something went wrong." };
}

/**
 * Central decision on which failures raise a toast. 400s are deliberately
 * silent — forms show those inline — which is why write call sites must still
 * use `unwrapApiResponse`.
 */
export function handleApiError(error: unknown) {
  const normalized = normalizeApiError(error);
  if (normalized.kind === "client" && normalized.status === 400) return normalized;
  if (normalized.status === 401) return normalized; // the session store handles sign-out
  toast.error(normalized.message);
  return normalized;
}

/** For mutation `onError`: always shows the message — a user action failed. */
export function toastError(error: unknown) {
  toast.error(normalizeApiError(error).message);
}
