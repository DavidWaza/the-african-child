import type { Metadata } from "next";
import { AdDashboard } from "@/features/admin/dashboard/ui/ad-dashboard";

export const metadata: Metadata = { title: "Overview" };

export default function AdminHomePage() {
  return <AdDashboard />;
}
