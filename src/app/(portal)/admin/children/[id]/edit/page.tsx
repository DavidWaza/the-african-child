import type { Metadata } from "next";
import { AdChildForm } from "@/features/admin/children/ui/ad-child-form";

export const metadata: Metadata = { title: "Edit child" };

export default async function AdminEditChildPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdChildForm id={id} />;
}
