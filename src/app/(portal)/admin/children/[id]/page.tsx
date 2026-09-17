import type { Metadata } from "next";
import { AdChild } from "@/features/admin/children/ui/ad-child";

export const metadata: Metadata = { title: "Child profile" };

export default async function AdminChildPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdChild id={id} />;
}
