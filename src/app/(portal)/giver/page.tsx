import type { Metadata } from "next";
import { GDashboard } from "@/features/giver/dashboard/ui/g-dashboard";

export const metadata: Metadata = { title: "Overview" };

export default function GiverHomePage() {
  return <GDashboard />;
}
