export interface PublicImpact {
  childrenSupported: number;
  schoolsPartnered: number;
  states: string[];
  giversCount: number;
  totalContributed: number;
  totalDisbursed: number;
  averageScore: number | null;
  resultsPublished: number;
  byCategory: { category: string; label: string; amount: number }[];
}

export const TRANSPARENCY_STEPS = [
  {
    icon: "pledge",
    title: "You pledge monthly",
    text: "Choose an amount that works for you. Every payment gets a reference you can see on your dashboard.",
  },
  {
    icon: "school",
    title: "We pay schools directly",
    text: "Fees go straight to the school bursar. Uniforms, books and feeding are bought and receipted by our team.",
  },
  {
    icon: "disbursement",
    title: "Every naira is itemised",
    text: "Each spend is logged against the child it helped, with the date and what it paid for.",
  },
  {
    icon: "results",
    title: "You see their results",
    text: "Term report cards are uploaded for every child, so you can watch them grow — and call their family.",
  },
] as const;
