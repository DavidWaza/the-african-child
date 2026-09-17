import type { Metadata } from "next";
import Link from "next/link";
import { NButton, NIcon } from "@/components/n";
import { DonateForm } from "@/components/site/forms";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = { title: "Donate" };

const MONTHLY_PERKS = [
  "Matched with a child you can follow",
  "Their term results, every term",
  "Every naira spent, itemised",
  "Call or message their family",
];

export default function DonatePage() {
  return (
    <>
      <PageHero
        image="/assets/donation-bg.jpg"
        eyebrow="Donate"
        title="A gift today keeps a child in class tomorrow."
        description="One-time gifts go to the programme pool and are spent where the need is greatest — and reported on our transparency page."
        className="min-h-[52vh]"
      />

      <section className="py-16 md:py-24">
        <div className="container-page grid items-start gap-8 lg:grid-cols-[1.25fr_1fr]">
          <div className="rounded-3xl border border-base-150 bg-base-0 p-6 shadow-sm md:p-10">
            <h2 className="text-3xl font-semibold">Make a one-time donation</h2>
            <p className="mt-1 mb-8 text-base-550">Choose an amount, or enter your own.</p>
            <DonateForm />
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
            <div className="relative overflow-hidden rounded-3xl bg-flow-primary p-8 text-base-0">
              <div className="absolute inset-0 pattern-footer opacity-[0.06]" aria-hidden />
              <div className="relative flex flex-col gap-5">
                <span className="w-fit rounded-full bg-flow-secondary px-3 py-1 text-xs font-semibold text-base-950">Most impact</span>
                <h3 className="text-3xl font-semibold">Give monthly, see everything</h3>
                <ul className="flex flex-col gap-3">
                  {MONTHLY_PERKS.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-base-0/85">
                      <NIcon name="complete" weight="fill" className="size-5 text-flow-secondary" /> {p}
                    </li>
                  ))}
                </ul>
                <NButton asChild size="lg" color="gold" className="w-full">
                  <Link href="/auth/register">
                    Become a monthly giver <NIcon name="forward" />
                  </Link>
                </NButton>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-3xl border border-base-150 bg-base-0 p-6">
              <NIcon name="transparency" weight="duotone" className="size-8 shrink-0 text-accent-500" />
              <p className="text-sm text-base-550">
                We publish what we receive and what we spend.{" "}
                <Link href="/transparency" className="font-semibold text-accent-600 hover:underline">
                  Read the transparency report
                </Link>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
