import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { NButton, NIcon } from "@/components/n";
import { PageHero, SectionHeading } from "@/components/site/page-hero";
import { INVOLVEMENT } from "@/components/site/site-content";

export const metadata: Metadata = { title: "Get involved" };

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero
        image="/assets/volunteer.jpg"
        eyebrow="Get involved"
        title="There's more than one way to keep a child learning."
        description="Give your time, your network or your organisation's support — every contribution is felt in a classroom."
      />

      <section className="py-20 md:py-28">
        <div className="container-page flex flex-col gap-12">
          <SectionHeading eyebrow="Ways to help" title="Find the role that fits you" />
          <ul className="grid gap-5 md:grid-cols-2">
            {INVOLVEMENT.map((item) => (
              <li key={item.title} className="group flex flex-col gap-4 rounded-3xl border border-base-150 bg-base-0 p-8 transition-shadow hover:shadow-xl">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-flow-s6 text-base-950 transition-colors group-hover:bg-flow-secondary">
                  <NIcon name={item.icon} weight="duotone" className="size-7" />
                </span>
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="flex-1 text-base-550">{item.text}</p>
                <NButton asChild color="secondary" variant="outline" className="w-fit">
                  <Link href={`/contact-us?topic=${item.topic}`}>
                    {item.cta} <NIcon name="forward" />
                  </Link>
                </NButton>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-page">
          <div className="grid overflow-hidden rounded-[2rem] bg-flow-primary text-base-0 lg:grid-cols-2">
            <div className="relative min-h-72">
              <Image src="/assets/smiling-kids.jpg" alt="Smiling children" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col justify-center gap-5 p-8 md:p-14">
              <h2 className="text-4xl font-semibold">The simplest way to help</h2>
              <p className="text-lg text-base-0/80">
                A monthly pledge from ₦10,000 keeps a child in secondary school — and gives you a dashboard to follow their progress.
              </p>
              <div className="flex flex-wrap gap-3">
                <NButton asChild size="lg" color="gold">
                  <Link href="/auth/register">Become a giver</Link>
                </NButton>
                <NButton asChild size="lg" color="inverse" variant="outline">
                  <Link href="/donate">Give once</Link>
                </NButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
