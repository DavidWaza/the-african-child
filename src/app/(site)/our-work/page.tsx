import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { NButton, NIcon } from "@/components/n";
import { PageHero, SectionHeading } from "@/components/site/page-hero";
import { StoriesRow, VideoStory } from "@/components/site/sections";
import { GALLERY, PROGRAMME_PILLARS } from "@/components/site/site-content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Our work" };

export default function OurWorkPage() {
  return (
    <>
      <PageHero
        image="/assets/community-help.jpg"
        eyebrow="Our work"
        title="Everything a secondary school student needs to stay in class"
        description="We cover the real costs of school, then follow each child's progress every term."
      />

      <section className="py-20 md:py-28">
        <div className="container-page flex flex-col gap-12">
          <SectionHeading eyebrow="What your giving pays for" title="Four ways we keep children learning" />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROGRAMME_PILLARS.map((p, i) => (
              <li
                key={p.title}
                className={cn("flex flex-col gap-4 rounded-3xl p-6", i === 0 ? "bg-flow-primary text-base-0" : "border border-base-150 bg-base-0")}
              >
                <NIcon name={p.icon} weight="duotone" className={cn("size-9", i === 0 ? "text-flow-secondary" : "text-flow-s3")} />
                <h3 className="text-xl font-semibold">{p.title}</h3>
                <p className={cn("text-sm leading-relaxed", i === 0 ? "text-base-0/75" : "text-base-550")}>{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-flow-s4 py-20 md:py-28">
        <div className="container-page flex flex-col gap-10">
          <SectionHeading eyebrow="In the field" title="Moments from our communities" />
          <ul className="grid auto-rows-[220px] grid-cols-2 gap-4 md:auto-rows-[260px] md:grid-cols-4">
            {GALLERY.map((g, i) => (
              <li
                key={g.src}
                className={cn("group relative overflow-hidden rounded-3xl", i === 0 && "col-span-2 row-span-2", i === 3 && "md:col-span-2")}
              >
                <Image src={g.src} alt={g.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-base-950/80 to-transparent p-4 text-base-0">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-flow-secondary uppercase">{g.category}</p>
                  <p className="font-display text-lg font-semibold">{g.title}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative overflow-hidden bg-flow-primary py-20 text-base-0 md:py-28">
        <div className="container-page flex flex-col gap-14">
          <SectionHeading tone="dark" eyebrow="Stories" title="Watch what changes when a child stays in school" />
          <VideoStory />
          <StoriesRow />
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container-page flex flex-col items-center gap-6 text-center">
          <SectionHeading align="center" title="Be part of the next story" description="Pledge monthly and follow a child's journey through secondary school." />
          <NButton asChild size="lg" color="gold">
            <Link href="/auth/register">
              Become a giver <NIcon name="forward" />
            </Link>
          </NButton>
        </div>
      </section>
    </>
  );
}
