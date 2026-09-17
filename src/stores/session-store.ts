"use client";

/**
 * Cross-screen client state: who is signed in. Persisted to localStorage and
 * mirrored into a cookie that the middleware reads to confine each role.
 *
 * The cookie is a routing hint, not a credential — every request is still
 * authorised by the backend against the bearer token. With a real API, the
 * backend should issue this cookie itself (httpOnly, signed).
 */
import { useSyncExternalStore } from "react";
import type { ApiRole } from "@/lib/api-types";
import { SESSION_COOKIE } from "@/lib/routing";

export interface SessionUser {
  id: string;
  role: ApiRole;
  fullName: string;
  email: string;
  phone: string | null;
}

export interface SessionState {
  token: string;
  user: SessionUser;
}

const STORAGE_KEY = "tac:session";
const listeners = new Set<() => void>();
let current: SessionState | null | undefined;

function read(): SessionState | null {
  if (current !== undefined) return current;
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    current = raw ? (JSON.parse(raw) as SessionState) : null;
  } catch {
    current = null;
  }
  return current;
}

function writeCookie(state: SessionState | null) {
  if (typeof document === "undefined") return;
  if (!state) {
    document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    return;
  }
  const value = encodeURIComponent(`${state.user.role}.${state.token}`);
  document.cookie = `${SESSION_COOKIE}=${value}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function setSession(state: SessionState | null) {
  current = state;
  try {
    if (state) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage unavailable — the in-memory session still works for this tab
  }
  writeCookie(state);
  listeners.forEach((l) => l());
}

export function getSessionToken(): string | null {
  return read()?.token ?? null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSession(): SessionState | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
