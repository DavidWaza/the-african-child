import type { Metadata } from "next";
import { AdChildForm } from "@/features/admin/children/ui/ad-child-form";

export const metadata: Metadata = { title: "Register a child" };

export default function AdminNewChildPage() {
  return <AdChildForm />;
}
