import type { Metadata } from "next";
import { NClientOnly } from "@/components/n";
import { ShPortalShell } from "@/features/shell/navigation/ui/sh-portal-shell";

export const metadata: Metadata = { title: { default: "Giver portal", template: "%s · Giver portal" }, robots: { index: false } };

/** Portal roots read client-resolved queries, so the page owns the client-only wrapper — applied uniformly here. */
export default function GiverLayout({ children }: { children: React.ReactNode }) {
  return (
    <NClientOnly>
      <ShPortalShell role="giver">{children}</ShPortalShell>
    </NClientOnly>
  );
}
