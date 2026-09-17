# The African Child

Public website plus two portals for a transparent secondary-school sponsorship programme.

- **Givers** (`/giver`): pledge monthly, see the total given, the children their money reaches, each child's term results and itemised spending, and contact the child's family.
- **Admins** (`/admin`): register children (secondary school only, JSS1–SSS3), manage schools, upload term results and report sheets, record spending, and match children with givers.

The structure follows [ARCHITECTURE.md](ARCHITECTURE.md), translated from Nuxt/Vue to Next.js/React.

## Getting started

```bash
npm install        # .npmrc sets legacy-peer-deps (react-simple-maps declares React ≤18)
npm run dev        # http://localhost:3000
```

With no backend configured, the app runs against an **in-browser mock API** that stores data in localStorage.

| Portal | Sign-in page | Demo account |
| ------ | ------------ | ------------ |
| Giver  | `/auth/login` | `ngozi@example.com` / `giver1234` |
| Admin  | `/admin/auth/login` | `admin@theafricanchild.org` / `admin1234` |

To reset the demo data, clear the site's localStorage.

## Connecting a real API

1. Implement the contract in `src/lib/api-types.ts` at the paths used in `src/mock-backend/index.ts`. Every response uses the `ApiResponse` envelope.
2. Set these environment variables:
   - `NEXT_PUBLIC_API_MODE=http`
   - `API_PROXY_TARGET=https://your-api` (proxied at `/backend`)
3. Issue the `tac_session` cookie from the server (httpOnly, signed). The mock's client-set cookie only drives routing.

## Layout

```
src/app/(site)       public pages          src/components/n     design-system parts (N-prefixed)
src/app/(auth)       sign-in / register    src/components/site  public-site sections
src/app/(portal)     giver + admin portals src/lib              tokens' helpers: icons, status, format, http, routing
src/features/<area>/<slice>/{domain,ports,adapters,application,composition,infrastructure,ui}
src/middleware.ts    role gate (reads ROLE_ROUTE_MAP)
```

Colours come only from the ramps in `src/app/globals.css`, which resets Tailwind's default palette (`--color-*: initial`). As a result, `bg-yellow-400`-style stock classes render nothing.
