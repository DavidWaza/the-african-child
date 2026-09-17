import type { Metadata } from "next";
import { AdChildren } from "@/features/admin/children/ui/ad-children";

export const metadata: Metadata = { title: "Children" };

export default async function AdminChildrenPage({ searchParams }: { searchParams: Promise<{ status?: string; school?: string }> }) {
  const { status, school } = await searchParams;
  // Keyed so arriving from a different filter link starts from that filter.
  return <AdChildren key={`${status ?? ""}-${school ?? ""}`} initialStatus={status} initialSchoolId={school} />;
}
