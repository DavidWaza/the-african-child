import { Suspense } from "react";
import type { Metadata } from "next";
import { NIcon } from "@/components/n";
import { ContactForm } from "@/components/site/forms";
import { PageHero } from "@/components/site/page-hero";
import { SITE_CONTACT } from "@/components/site/site-content";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  const details = [
    { icon: "location" as const, label: "Visit", value: SITE_CONTACT.address },
    { icon: "phone" as const, label: "Call", value: SITE_CONTACT.phone, href: `tel:${SITE_CONTACT.phone.replace(/\s/g, "")}` },
    { icon: "email" as const, label: "Email", value: SITE_CONTACT.email, href: `mailto:${SITE_CONTACT.email}` },
    { icon: "calendar" as const, label: "Hours", value: SITE_CONTACT.hours },
  ];

  return (
    <>
      <PageHero
        image="/assets/smiling-kids.jpg"
        eyebrow="Contact us"
        title="We'd love to hear from you."
        description="Questions about giving, partnerships, or referring a child — our team replies within two working days."
        className="min-h-[52vh]"
      />

      <section className="py-16 md:py-24">
        <div className="container-page grid items-start gap-8 lg:grid-cols-[1fr_1.6fr]">
          <aside className="flex flex-col gap-4">
            {details.map((d) => (
              <div key={d.label} className="flex items-start gap-4 rounded-3xl border border-base-150 bg-base-0 p-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent-50 text-accent-500">
                  <NIcon name={d.icon} weight="duotone" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.14em] text-base-500 uppercase">{d.label}</p>
                  {d.href ? (
                    <a href={d.href} className="font-medium break-words text-base-900 hover:text-accent-600">
                      {d.value}
                    </a>
                  ) : (
                    <p className="font-medium text-base-900">{d.value}</p>
                  )}
                </div>
              </div>
            ))}
          </aside>
          <div className="rounded-3xl border border-base-150 bg-base-0 p-6 shadow-sm md:p-10">
            <h2 className="mb-8 text-3xl font-semibold">Send us a message</h2>
            <Suspense>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
