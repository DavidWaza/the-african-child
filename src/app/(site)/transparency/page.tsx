import type { Metadata } from "next";
import Link from "next/link";
import { NButton, NClientOnly, NIcon } from "@/components/n";
import { PageHero, SectionHeading } from "@/components/site/page-hero";
import { PImpactReport, PTransparencySteps } from "@/features/public/impact/ui/p-impact";

export const metadata: Metadata = {
  title: "Transparency report",
  description: "Live totals of what our community has given, what has been spent on children, and how they are doing in school.",
};

export default function TransparencyPage() {
  return (
    <>
      <PageHero
        image="/assets/muslim-school-kids.jpg"
        eyebrow="Transparency report"
        title="Every naira, accounted for."
        description="These numbers update as givers contribute, as we pay schools, and as report cards are uploaded. No child's personal details are shown here."
      >
        <NButton asChild size="lg" color="gold">
          <Link href="/auth/register">Become a giver</Link>
        </NButton>
      </PageHero>

      <section className="py-20 md:py-28">
        <div className="container-page flex flex-col gap-12">
          <SectionHeading eyebrow="Live programme totals" title="Where the programme stands today" />
          <NClientOnly>
            <PImpactReport />
          </NClientOnly>
        </div>
      </section>

      <section className="bg-flow-s4 py-20 md:py-28">
        <div className="container-page flex flex-col gap-12">
          <SectionHeading eyebrow="How it works" title="From your pledge to their classroom" />
          <PTransparencySteps />
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-base-0 p-8 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent-50 text-accent-500">
                <NIcon name="lock" weight="duotone" className="size-6" />
              </span>
              <div>
                <h3 className="text-xl font-semibold">Givers see the full picture</h3>
                <p className="text-base-550">Names, photos, results, receipts and family contact are visible only to the givers matched with each child.</p>
              </div>
            </div>
            <NButton asChild color="secondary" variant="outline">
              <Link href="/auth/login">Giver sign in</Link>
            </NButton>
          </div>
        </div>
      </section>
    </>
  );
}
