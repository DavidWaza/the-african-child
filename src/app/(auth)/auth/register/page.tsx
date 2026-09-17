import { Suspense } from "react";
import type { Metadata } from "next";
import { AAuthFrame } from "@/features/auth/session/ui/a-auth-frame";
import { ARegister } from "@/features/auth/session/ui/a-register";

export const metadata: Metadata = { title: "Become a giver" };

export default function RegisterPage() {
  return (
    <AAuthFrame
      eyebrow="Become a giver"
      title="Keep a child in school"
      description="Pledge monthly and get your own dashboard: every contribution, every result, and a line to the family."
      aside={{
        image: "/assets/group-african-kids-standing-each-other-class.jpg",
        quote: "Education is the one gift that keeps multiplying long after it's given.",
        caption: "— The African Child Initiative",
      }}
    >
      <Suspense>
        <ARegister />
      </Suspense>
    </AAuthFrame>
  );
}
