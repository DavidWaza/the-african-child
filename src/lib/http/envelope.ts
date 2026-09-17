/**
 * Every endpoint answers with this envelope.
 *
 * THE TRAP: `status: false` arrives on an HTTP 200. Nothing in the transport
 * throws for it. A call site that only asks "did a response come back?" reads a
 * rejection as a success. Every write goes through `unwrapApiResponse`; every
 * read checks `response?.status` before trusting `data`.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  status: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

/**
 * - `undefined` means the request never completed (network, cancelled,
 *   unreachable) — a different case from `status: false`.
 * - `status: false` is the backend refusing, with a message worth showing.
 */
export function unwrapApiResponse<T>(res: ApiResponse<T> | undefined, fallback: string): ApiResponse<T> {
  if (!res) throw new Error(fallback);
  if (!res.status) throw new Error(res.message?.trim() || fallback);
  return res;
}

/** Envelope → data, or a safe empty value on the read side. */
export function readData<T>(res: ApiResponse<T> | undefined, empty: T): T {
  if (!res?.status || res.data == null) return empty;
  return res.data;
}

export type RequestFilters = {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined | null;
};

/** Builds a query string, dropping every undefined / null / empty key. */
export function buildSearchParams(filters: RequestFilters = {}): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const DEFAULT_PAGINATION = { page: 1, limit: 10 } as const;
