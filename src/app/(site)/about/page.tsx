import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { NButton, NIcon } from "@/components/n";
import { PageHero, SectionHeading } from "@/components/site/page-hero";
import { PARTNERS, TEAM } from "@/components/site/site-content";

export const metadata: Metadata = { title: "About us" };

export default function AboutPage() {
  return (
    <>
      <PageHero
        image="/assets/african-life-child.jpg"
        eyebrow="About the programme"
        title="We keep bright children in secondary school — and show you every step."
        description="The African Child Initiative pairs monthly givers with Nigerian secondary school students, then reports back term after term."
      />

      <section className="py-20 md:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem]">
            <Image src="/assets/group-classroom.jpg" alt="A classroom of students" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="The challenge"
              title={
                <>
                  45 million children across 37 states are at risk of <span className="text-flow-s3">illiteracy</span>.
                </>
              }
            />
            <p className="text-lg text-base-550">
              Most leave school at the jump from primary to secondary, when fees, uniforms, books and transport become too much for their families.
              That&apos;s exactly where we step in — and why we focus only on secondary school.
            </p>
            <p className="text-sm text-base-400">Source: Al Jazeera</p>
          </div>
        </div>
      </section>

      <section className="bg-flow-s4 py-20 md:py-28">
        <div className="container-page grid gap-6 md:grid-cols-2">
          <article className="flex flex-col gap-4 rounded-3xl bg-base-0 p-8 md:p-10">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-accent-50 text-accent-500">
              <NIcon name="mission" weight="duotone" className="size-7" />
            </span>
            <h2 className="text-3xl font-semibold">Our mission</h2>
            <p className="text-lg leading-relaxed text-base-550">
              To ignite curiosity, nurture potential and champion the well-being of every African child by providing access to quality education and safe
              learning environments — empowering them to become the leaders and innovators of a prosperous Africa.
            </p>
          </article>
          <article className="flex flex-col gap-4 rounded-3xl bg-flow-primary p-8 text-base-0 md:p-10">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-base-0/10 text-flow-secondary">
              <NIcon name="vision" weight="duotone" className="size-7" />
            </span>
            <h2 className="text-3xl font-semibold">Our vision</h2>
            <p className="text-lg leading-relaxed text-base-0/80">
              An Africa where every child is equipped with the knowledge, skills and confidence to realise their fullest potential — shaping a future of
              opportunity, dignity and sustainable development for the continent.
            </p>
          </article>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-page flex flex-col gap-12">
          <SectionHeading eyebrow="Our team" title="The people behind the programme" align="center" />
          <ul className="mx-auto grid w-full max-w-4xl gap-6 sm:grid-cols-2">
            {TEAM.map((m) => (
              <li key={m.name} className="overflow-hidden rounded-3xl border border-base-150 bg-base-0">
                <div className="relative aspect-[4/3] bg-flow-s4">
                  <Image src={m.image} alt={m.name} fill sizes="(min-width: 640px) 40vw, 100vw" className="object-cover object-top" />
                </div>
                <div className="flex flex-col gap-1 p-6">
                  <h3 className="text-2xl font-semibold">{m.name}</h3>
                  <p className="text-sm font-medium text-accent-600">{m.role}</p>
                  <p className="mt-2 text-base-550">{m.bio}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-base-150 bg-base-0 py-14">
        <div className="container-page flex flex-col gap-8">
          <p className="text-center text-xs font-semibold tracking-[0.16em] text-base-500 uppercase">Partners who make it possible</p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
            <ul className="flex w-max animate-marquee gap-12">
              {[...PARTNERS, ...PARTNERS].map((p, i) => (
                <li key={i} className="flex shrink-0 items-center gap-3 font-display text-2xl whitespace-nowrap text-base-400" aria-hidden={i >= PARTNERS.length}>
                  <Image src="/assets/aci-logo-3.png" alt="" width={32} height={32} className="size-8 opacity-60 grayscale" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 text-center md:py-28">
        <div className="container-page flex flex-col items-center gap-6">
          <SectionHeading align="center" title="Join us in building a brighter future" description="Together we can make a tangible difference in the lives of children across Nigeria." />
          <div className="flex flex-wrap justify-center gap-3">
            <NButton asChild size="lg" color="gold">
              <Link href="/auth/register">Become a giver</Link>
            </NButton>
            <NButton asChild size="lg" color="secondary" variant="outline">
              <Link href="/get-involved">Other ways to help</Link>
            </NButton>
          </div>
        </div>
      </section>
    </>
  );
}
