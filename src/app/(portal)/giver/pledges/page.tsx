import type { Metadata } from "next";
import { GPledges } from "@/features/giver/pledges/ui/g-pledges";

export const metadata: Metadata = { title: "Pledges & giving" };

export default function GiverPledgesPage() {
  return <GPledges />;
}
