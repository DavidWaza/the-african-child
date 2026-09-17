import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    // The old header linked here.
    return [{ source: "/transparency-dashboard", destination: "/transparency", permanent: true }];
  },
  async rewrites() {
    // Same-origin proxy for the real API (NEXT_PUBLIC_API_MODE=http): the browser
    // only ever talks to /backend, so session cookies are issued for this origin.
    const target = process.env.API_PROXY_TARGET;
    return target ? [{ source: "/backend/:path*", destination: `${target}/:path*` }] : [];
  },
};

export default nextConfig;
