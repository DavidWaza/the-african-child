import type { Metadata } from "next";
import { GChild } from "@/features/giver/children/ui/g-child";

export const metadata: Metadata = { title: "Child profile" };

export default async function GiverChildPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GChild id={id} />;
}
