import type { Metadata } from "next";
import { GChildren } from "@/features/giver/children/ui/g-children";

export const metadata: Metadata = { title: "My children" };

export default function GiverChildrenPage() {
  return <GChildren />;
}
