/**
 * Role → area map. The middleware only reads this file: adding a role is a data
 * change here, not a change to the gate.
 */
import type { ApiRole } from "@/lib/api-types";

export interface RoleRoute {
  label: string;
  home: string;
  loginPath: string;
  prefixes: string[];
}

export const ROLE_ROUTE_MAP: Record<ApiRole, RoleRoute> = {
  giver: {
    label: "Giver",
    home: "/giver",
    loginPath: "/auth/login",
    prefixes: ["/giver"],
  },
  admin: {
    label: "Administrator",
    home: "/admin",
    loginPath: "/admin/auth/login",
    prefixes: ["/admin"],
  },
};

/** Pages under a protected prefix that anyone may open. */
export const PUBLIC_EXEMPT_PREFIXES = ["/admin/auth"];

/** Authenticated routes open to every role. */
export const SHARED_AUTHENTICATED_PREFIXES: string[] = [];

export const SESSION_COOKIE = "tac_session";

export function isRole(value: unknown): value is ApiRole {
  return typeof value === "string" && value in ROLE_ROUTE_MAP;
}

export function areaForPath(pathname: string): ApiRole | null {
  for (const [role, route] of Object.entries(ROLE_ROUTE_MAP) as [ApiRole, RoleRoute][]) {
    if (route.prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return role;
  }
  return null;
}

export const matchesPrefix = (pathname: string, prefixes: string[]) =>
  prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
