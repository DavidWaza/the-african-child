import type { Metadata } from "next";
import { AdSchools } from "@/features/admin/schools/ui/ad-schools";

export const metadata: Metadata = { title: "Schools" };

export default function AdminSchoolsPage() {
  return <AdSchools />;
}
