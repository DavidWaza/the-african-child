import type { Metadata } from "next";
import { NClientOnly } from "@/components/n";
import { ShPortalShell } from "@/features/shell/navigation/ui/sh-portal-shell";

export const metadata: Metadata = { title: { default: "Admin portal", template: "%s · Admin portal" }, robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <NClientOnly>
      <ShPortalShell role="admin">{children}</ShPortalShell>
    </NClientOnly>
  );
}
