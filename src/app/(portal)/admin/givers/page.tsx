import type { Metadata } from "next";
import { AdGivers } from "@/features/admin/givers/ui/ad-givers";

export const metadata: Metadata = { title: "Givers & pledges" };

export default function AdminGiversPage() {
  return <AdGivers />;
}
