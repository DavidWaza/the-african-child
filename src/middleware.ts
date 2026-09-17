import { NextResponse, type NextRequest } from "next/server";
import {
  areaForPath,
  isRole,
  matchesPrefix,
  PUBLIC_EXEMPT_PREFIXES,
  ROLE_ROUTE_MAP,
  SESSION_COOKIE,
  SHARED_AUTHENTICATED_PREFIXES,
} from "@/lib/routing";

/**
 * The single route gate. Order matters:
 *  1. Anything outside a role area is public.
 *  2. Sign-in pages inside an area are exempt (signed-in users are sent home).
 *  3. No session → that area's sign-in page, remembering where they were going.
 *  4. Shared authenticated routes skip role confinement.
 *  5. A role in another role's area → 403.
 *
 * Adding a role is a change to ROLE_ROUTE_MAP, not to this file.
 * The cookie only routes; the API authorises every request itself.
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const raw = req.cookies.get(SESSION_COOKIE)?.value;
  const role = raw ? decodeURIComponent(raw).split(".")[0] : null;
  const sessionRole = isRole(role) ? role : null;

  // Signed-in users don't need a sign-in page.
  if (sessionRole && (pathname === "/auth/login" || pathname === "/auth/register" || matchesPrefix(pathname, PUBLIC_EXEMPT_PREFIXES))) {
    return NextResponse.redirect(new URL(ROLE_ROUTE_MAP[sessionRole].home, req.url));
  }

  const area = areaForPath(pathname);
  if (!area || matchesPrefix(pathname, PUBLIC_EXEMPT_PREFIXES)) return NextResponse.next();

  if (!sessionRole) {
    const login = new URL(ROLE_ROUTE_MAP[area].loginPath, req.url);
    login.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  if (matchesPrefix(pathname, SHARED_AUTHENTICATED_PREFIXES)) return NextResponse.next();

  if (area !== sessionRole) {
    return NextResponse.rewrite(new URL("/forbidden", req.url), { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/giver/:path*", "/admin/:path*", "/auth/:path*"],
};
