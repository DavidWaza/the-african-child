import Image from "next/image";
import Link from "next/link";
import { NButton, NClientOnly, NIcon } from "@/components/n";
import { PageHero, SectionHeading } from "@/components/site/page-hero";
import { GiverPortalPreview, StoriesRow, VideoStory } from "@/components/site/sections";
import { BARRIERS } from "@/components/site/site-content";
import { PImpactStrip, PTransparencySteps } from "@/features/public/impact/ui/p-impact";
import { PImpactMap } from "@/features/public/impact/ui/p-impact-map";

export default function HomePage() {
  return (
    <>
      <PageHero
        image="/assets/school-kids-banner.jpg"
        eyebrow="Secondary education · Nigeria"
        title={
          <>
            Every child deserves to <em className="text-flow-secondary not-italic">finish school.</em>
          </>
        }
        description="Give monthly to keep a Nigerian child in secondary school — and see every naira spent, every report card, and the family you're helping."
        className="min-h-[92vh]"
      >
        <NButton asChild size="lg" color="gold">
          <Link href="/auth/register">
            Become a monthly giver <NIcon name="forward" />
          </Link>
        </NButton>
        <NButton asChild size="lg" color="inverse" variant="outline">
          <Link href="/transparency">See where the money goes</Link>
        </NButton>
      </PageHero>

      <section className="bg-flow-primary pb-20">
        <div className="container-page relative z-10 -mt-10 md:-mt-14">
          <NClientOnly>
            <PImpactStrip />
          </NClientOnly>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <Image src="/assets/group-classroom.jpg" alt="Students in a Nigerian classroom" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute -right-2 -bottom-6 max-w-[16rem] rounded-2xl bg-flow-secondary p-5 text-base-950 shadow-xl md:-right-8">
              <p className="font-display text-4xl font-semibold">45M</p>
              <p className="text-sm">children across Nigeria are at risk of illiteracy.</p>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="Why we do this"
              title="Talent is everywhere. School fees shouldn't decide who learns."
              description="Education is the most reliable way out of poverty, yet millions of bright children leave school after primary. Understanding why is the first step to keeping them there."
            />
            <ul className="grid gap-4 sm:grid-cols-2">
              {BARRIERS.map((b) => (
                <li key={b.title} className="flex flex-col gap-2 rounded-2xl border border-base-150 bg-base-0 p-5">
                  <NIcon name={b.icon} weight="duotone" className="size-7 text-flow-s3" />
                  <h3 className="font-sans text-base font-semibold tracking-normal">{b.title}</h3>
                  <p className="text-sm leading-relaxed text-base-550">{b.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-flow-s4 py-20 md:py-28">
        <div className="container-page flex flex-col gap-14">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col gap-6">
              <SectionHeading
                eyebrow="Total transparency"
                title="Your own dashboard for the children you support"
                description="Givers get a private portal: every contribution with a reference, every naira spent on each child, their term results — and a direct line to their family."
              />
              <div className="flex flex-wrap gap-3">
                <NButton asChild size="lg">
                  <Link href="/auth/register">Start giving</Link>
                </NButton>
                <NButton asChild size="lg" color="secondary" variant="outline">
                  <Link href="/auth/login">Giver sign in</Link>
                </NButton>
              </div>
            </div>
            <GiverPortalPreview />
          </div>
          <PTransparencySteps />
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-page">
          <NClientOnly>
            <PImpactMap />
          </NClientOnly>
        </div>
      </section>

      <section className="relative overflow-hidden bg-flow-primary py-20 text-base-0 md:py-28">
        <div className="absolute inset-0 pattern-footer opacity-[0.05]" aria-hidden />
        <div className="container-page relative flex flex-col gap-14">
          <div className="grid items-end gap-8 lg:grid-cols-2">
            <SectionHeading tone="dark" eyebrow="Journeys of transformation" title="Bright minds, empowered by generosity" />
            <p className="text-lg text-base-0/75 lg:justify-self-end lg:text-right">Names and photos shared with the permission of each family.</p>
          </div>
          <VideoStory />
          <StoriesRow />
        </div>
      </section>
    </>
  );
}
