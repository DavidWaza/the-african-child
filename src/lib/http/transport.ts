import axios from "axios";
import { mockRequest } from "@/mock-backend";
import { getSessionToken } from "@/stores/session-store";
import type { ApiResponse } from "./envelope";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface Transport {
  request<T>(method: HttpMethod, path: string, body?: unknown): Promise<ApiResponse<T> | undefined>;
}

/**
 * Real backend. Requests go to NEXT_PUBLIC_API_BASE_URL — ideally a same-origin
 * path (`/backend`) rewritten to the API in next.config.ts, so the session
 * cookie is issued for this origin.
 */
const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/backend",
  withCredentials: true,
  timeout: 30_000,
});

client.interceptors.request.use((config) => {
  const token = getSessionToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const httpTransport: Transport = {
  async request<T>(method: HttpMethod, path: string, body?: unknown) {
    const res = await client.request<ApiResponse<T>>({ method, url: path, data: body });
    return res.data;
  },
};

/** In-browser fake API. Same envelope, same paths, with latency. */
const mockTransport: Transport = {
  request: <T>(method: HttpMethod, path: string, body?: unknown) =>
    mockRequest<T>(method, path, body, getSessionToken()),
};

/**
 * THE SWAP POINT. Every slice's service adapter talks to `transport`; flipping
 * NEXT_PUBLIC_API_MODE to "http" moves the whole app onto the real API.
 */
export const transport: Transport = process.env.NEXT_PUBLIC_API_MODE === "http" ? httpTransport : mockTransport;

export const api = {
  get: <T>(path: string) => transport.request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => transport.request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => transport.request<T>("PUT", path, body),
  delete: <T>(path: string) => transport.request<T>("DELETE", path),
};
