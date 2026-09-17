"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { NAvatar, NButton, NIcon } from "@/components/n";
import type { ApiRole } from "@/lib/api-types";
import { ROLE_ROUTE_MAP } from "@/lib/routing";
import { cn } from "@/lib/utils";
import { setSession, useSession } from "@/stores/session-store";
import { useSignOut } from "@/hooks/use-sign-out";
import { isNavActive, NAVIGATION } from "../domain/navigation-registry";

function Brand({ role }: { role: ApiRole }) {
  return (
    <Link href={ROLE_ROUTE_MAP[role].home} className="flex items-center gap-3 px-2">
      <Image src="/assets/aci-logo-2.svg" alt="" width={40} height={40} className="h-9 w-auto" />
      <span className="flex flex-col leading-tight">
        <span className="font-display text-[15px] font-semibold text-base-0">The African Child</span>
        <span className="text-[11px] font-medium tracking-[0.14em] text-flow-secondary uppercase">
          {role === "admin" ? "Admin portal" : "Giver portal"}
        </span>
      </span>
    </Link>
  );
}

function NavList({ role, onNavigate }: { role: ApiRole; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-6" aria-label="Portal">
      {NAVIGATION[role].map((group, i) => (
        <div key={group.label ?? i} className="flex flex-col gap-1">
          {group.label && <p className="px-3 pb-1 text-[11px] font-semibold tracking-[0.14em] text-base-0/45 uppercase">{group.label}</p>}
          {group.items.map((item) => {
            const active = isNavActive(item, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-base-0 text-flow-primary shadow-sm" : "text-base-0/75 hover:bg-base-0/10 hover:text-base-0",
                )}
              >
                <NIcon name={item.icon} weight={active ? "fill" : "regular"} className={cn("size-5", active ? "text-accent-500" : "")} />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function UserCard() {
  const session = useSession();
  const signOut = useSignOut();
  if (!session) return null;
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-base-0/8 p-3">
      <NAvatar name={session.user.fullName} className="size-9 ring-flow-s2" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-base-0">{session.user.fullName}</p>
        <p className="truncate text-xs text-base-0/60">{session.user.email}</p>
      </div>
      <NButton size="icon-sm" color="inverse" variant="ghost" onClick={signOut} aria-label="Sign out" title="Sign out">
        <NIcon name="signOut" />
      </NButton>
    </div>
  );
}

function SidebarBody({ role, onNavigate }: { role: ApiRole; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-8 bg-flow-primary px-4 py-6 pattern-footer [background-blend-mode:soft-light]">
      <Brand role={role} />
      <div className="flex-1 overflow-y-auto">
        <NavList role={role} onNavigate={onNavigate} />
      </div>
      <UserCard />
    </div>
  );
}

/**
 * The portal chrome. Also the client-side half of the auth gate: the middleware
 * confines routes by cookie; this confirms a usable session exists in storage.
 */
export function ShPortalShell({ role, children }: { role: ApiRole; children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const title = NAVIGATION[role].flatMap((g) => g.items).find((i) => isNavActive(i, pathname))?.label;

  React.useEffect(() => {
    if (session === null) {
      // Storage was cleared but the routing cookie survived: drop it, or the
      // middleware would bounce the sign-in page straight back here.
      setSession(null);
      router.replace(`${ROLE_ROUTE_MAP[role].loginPath}?next=${encodeURIComponent(pathname)}`);
    } else if (session.user.role !== role) {
      router.replace(ROLE_ROUTE_MAP[session.user.role].home);
    }
  }, [session, role, router, pathname]);

  if (!session || session.user.role !== role) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-base-50">
        <span className="size-8 animate-spin rounded-full border-3 border-accent-150 border-t-accent-500" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-base-50 lg:grid lg:grid-cols-[272px_1fr]">
      <aside className="sticky top-0 hidden h-dvh lg:block">
        <SidebarBody role={role} />
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-base-150 bg-base-0/90 px-4 backdrop-blur lg:hidden">
          <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
            <DialogPrimitive.Trigger asChild>
              <NButton size="icon-sm" color="secondary" variant="outline" aria-label="Open menu">
                <NIcon name="menu" />
              </NButton>
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
              <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-base-950/50 data-[state=open]:animate-fade" />
              <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-xs outline-none data-[state=open]:animate-fade">
                <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>
                <SidebarBody role={role} onNavigate={() => setOpen(false)} />
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
          <p className="truncate font-semibold text-base-900">{title ?? "Portal"}</p>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
