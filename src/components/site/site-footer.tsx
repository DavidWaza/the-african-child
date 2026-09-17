import Image from "next/image";
import Link from "next/link";
import { InstagramLogo, MetaLogo, XLogo } from "@phosphor-icons/react/dist/ssr";
import { NButton, NIcon } from "@/components/n";
import { SITE_CONTACT } from "./site-content";

const COLUMNS = [
  {
    title: "Programme",
    links: [
      { href: "/about", label: "About us" },
      { href: "/our-work", label: "Our work" },
      { href: "/transparency", label: "Transparency report" },
    ],
  },
  {
    title: "Take part",
    links: [
      { href: "/auth/register", label: "Become a giver" },
      { href: "/donate", label: "One-time donation" },
      { href: "/get-involved", label: "Volunteer & partner" },
    ],
  },
  {
    title: "Portals",
    links: [
      { href: "/auth/login", label: "Giver sign in" },
      { href: "/admin/auth/login", label: "Staff sign in" },
      { href: "/contact-us", label: "Contact us" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-flow-s5 text-base-0">
      <div className="absolute inset-0 pattern-footer opacity-[0.06]" aria-hidden />
      <div className="container-page relative flex flex-col gap-14 py-16 md:py-20">
        <div className="flex flex-col justify-between gap-8 rounded-3xl bg-flow-secondary p-8 text-base-950 md:flex-row md:items-center md:p-10">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold md:text-4xl">Keep a child in school this month.</h2>
            <p className="mt-2 text-base-600">From ₦10,000 a month — and you&apos;ll see their report card every term.</p>
          </div>
          <NButton asChild size="lg" color="neutral" className="w-full md:w-auto">
            <Link href="/auth/register">
              Start giving monthly <NIcon name="forward" />
            </Link>
          </NButton>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/assets/aci-logo-2.svg" alt="" width={48} height={48} className="h-12 w-auto" />
              <span className="font-display text-xl font-semibold">The African Child</span>
            </Link>
            <p className="max-w-xs text-sm text-base-0/65">Planting seeds of knowledge, growing brighter futures — one secondary school student at a time.</p>
            <address className="flex flex-col gap-2 text-sm text-base-0/80 not-italic">
              <span className="inline-flex items-center gap-2">
                <NIcon name="location" className="size-4 text-flow-secondary" /> {SITE_CONTACT.address}
              </span>
              <a href={`tel:${SITE_CONTACT.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:text-flow-secondary">
                <NIcon name="phone" className="size-4 text-flow-secondary" /> {SITE_CONTACT.phone}
              </a>
              <a href={`mailto:${SITE_CONTACT.email}`} className="inline-flex items-center gap-2 hover:text-flow-secondary">
                <NIcon name="email" className="size-4 text-flow-secondary" /> {SITE_CONTACT.email}
              </a>
            </address>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-sans text-xs font-semibold tracking-[0.16em] text-flow-secondary uppercase">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-base-0/75 transition-colors hover:text-base-0">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-base-0/10 pt-6 text-sm text-base-0/55 sm:flex-row sm:items-center">
          <p>© {year} The African Child Initiative. All rights reserved.</p>
          <div className="flex gap-2">
            {[
              { label: "Facebook", Icon: MetaLogo },
              { label: "X", Icon: XLogo },
              { label: "Instagram", Icon: InstagramLogo },
            ].map(({ label, Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border border-base-0/15 text-base-0/75 transition-colors hover:border-flow-secondary hover:text-flow-secondary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
