import type { Metadata } from "next";
import { AdResults } from "@/features/admin/results/ui/ad-results";

export const metadata: Metadata = { title: "Results" };

export default async function AdminResultsPage({ searchParams }: { searchParams: Promise<{ upload?: string; child?: string }> }) {
  const { upload, child } = await searchParams;
  return <AdResults key={`${upload ?? ""}-${child ?? ""}`} initialUpload={upload === "1"} initialChildId={child} />;
}
