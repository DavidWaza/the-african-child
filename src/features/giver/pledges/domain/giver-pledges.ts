import { z } from "zod";
import type { Contribution } from "@/lib/dto";

export const PLEDGE_AMOUNTS = [10000, 25000, 50000, 100000] as const;

/** What a monthly amount covers — shown beside the picker. */
export const PLEDGE_IMPACT: { min: number; text: string }[] = [
  { min: 100000, text: "Tuition, uniform, books and a term of lunches for one student." },
  { min: 50000, text: "A term's tuition and levies for one secondary school student." },
  { min: 25000, text: "A full set of textbooks and exam-prep materials." },
  { min: 10000, text: "A school uniform and a pair of sandals." },
  { min: 0, text: "Notebooks, pens and a mathematical set." },
];

export const impactFor = (amount: number) => PLEDGE_IMPACT.find((p) => amount >= p.min)!.text;

export const pledgeSchema = z.object({
  monthlyAmount: z.coerce.number({ invalid_type_error: "Enter an amount." }).min(1000, "The minimum monthly pledge is ₦1,000."),
});

export type PledgeFormValues = z.input<typeof pledgeSchema>;
export type PledgeFormOutput = z.output<typeof pledgeSchema>;

export function givingTotals(rows: Contribution[]) {
  const paid = rows.filter((r) => r.status === "paid");
  const year = new Date().getFullYear().toString();
  return {
    lifetime: paid.reduce((a, r) => a + r.amount, 0),
    thisYear: paid.filter((r) => r.month.startsWith(year)).reduce((a, r) => a + r.amount, 0),
    count: paid.length,
  };
}
