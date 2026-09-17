"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { NButton, NIcon } from "@/components/n";
import { ROLE_ROUTE_MAP } from "@/lib/routing";
import { cn } from "@/lib/utils";
import { useSession } from "@/stores/session-store";

export const SITE_NAV = [
  { href: "/about", label: "About" },
  { href: "/our-work", label: "Our work" },
  { href: "/transparency", label: "Transparency" },
  { href: "/get-involved", label: "Get involved" },
  { href: "/contact-us", label: "Contact" },
];

/** Pages whose hero is a dark image, so the header starts transparent over it. */
const DARK_HERO_PATHS = ["/", "/about", "/our-work", "/donate", "/get-involved", "/contact-us", "/transparency"];

function PortalButton({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const session = useSession();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (mounted && session) {
    return (
      <NButton asChild size="sm" color="secondary" variant="soft" className={className}>
        <Link href={ROLE_ROUTE_MAP[session.user.role].home} onClick={onNavigate}>
          <NIcon name="dashboard" /> My dashboard
        </Link>
      </NButton>
    );
  }
  return (
    <NButton asChild size="sm" color="secondary" variant="ghost" className={className}>
      <Link href="/auth/login" onClick={onNavigate}>
        Giver sign in
      </Link>
    </NButton>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overHero = DARK_HERO_PATHS.includes(pathname) && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,color] duration-300",
        overHero ? "bg-transparent text-base-0" : "bg-base-0/90 text-base-900 shadow-[0_1px_0_var(--base-150)] backdrop-blur-md",
      )}
    >
      <div className="container-page flex h-18 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image src="/assets/aci-logo-2.svg" alt="" width={44} height={44} className="h-10 w-auto" priority />
          <span className="font-display text-lg leading-none font-semibold">
            The African
            <br className="sm:hidden" /> Child
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {SITE_NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                      overHero ? "text-base-0/85 hover:bg-base-0/10 hover:text-base-0" : "text-base-600 hover:bg-base-100 hover:text-base-950",
                      active && (overHero ? "bg-base-0/15 text-base-0" : "bg-accent-50 text-accent-600"),
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <PortalButton className={overHero ? "text-base-0 hover:bg-base-0/10 hover:text-base-0" : undefined} />
          <NButton asChild size="sm" color="gold">
            <Link href="/donate">
              <NIcon name="family" weight="fill" /> Donate
            </Link>
          </NButton>
        </div>

        <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
          <DialogPrimitive.Trigger asChild>
            <NButton size="icon-sm" color={overHero ? "inverse" : "secondary"} variant="outline" className="lg:hidden" aria-label="Open menu">
              <NIcon name="menu" />
            </NButton>
          </DialogPrimitive.Trigger>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-base-950/50 data-[state=open]:animate-fade" />
            <DialogPrimitive.Content className="fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-sm flex-col gap-6 bg-base-0 p-6 outline-none data-[state=open]:animate-fade">
              <div className="flex items-center justify-between">
                <DialogPrimitive.Title className="font-display text-lg font-semibold">Menu</DialogPrimitive.Title>
                <DialogPrimitive.Close asChild>
                  <NButton size="icon-sm" color="secondary" variant="ghost" aria-label="Close menu">
                    <NIcon name="close" />
                  </NButton>
                </DialogPrimitive.Close>
              </div>
              <nav aria-label="Mobile">
                <ul className="flex flex-col">
                  {[{ href: "/", label: "Home" }, ...SITE_NAV].map((item) => (
                    <li key={item.href} className="border-b border-base-100">
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center justify-between py-3.5 font-display text-xl",
                          pathname === item.href ? "text-accent-600" : "text-base-900",
                        )}
                      >
                        {item.label}
                        <NIcon name="chevronRight" className="size-4 text-base-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-auto flex flex-col gap-2">
                <NButton asChild color="gold" size="lg">
                  <Link href="/donate" onClick={() => setOpen(false)}>
                    Donate
                  </Link>
                </NButton>
                <NButton asChild size="lg">
                  <Link href="/auth/register" onClick={() => setOpen(false)}>
                    Become a monthly giver
                  </Link>
                </NButton>
                <PortalButton className="h-11" onNavigate={() => setOpen(false)} />
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      </div>
    </header>
  );
}
