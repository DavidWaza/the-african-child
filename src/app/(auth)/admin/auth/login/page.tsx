import { Suspense } from "react";
import type { Metadata } from "next";
import { AAuthFrame } from "@/features/auth/session/ui/a-auth-frame";
import { ASignIn } from "@/features/auth/session/ui/a-sign-in";

export const metadata: Metadata = { title: "Staff sign in", robots: { index: false } };

export default function AdminLoginPage() {
  return (
    <AAuthFrame
      eyebrow="Admin portal"
      title="Programme staff sign in"
      description="Manage children, schools, results and giving."
      aside={{
        image: "/assets/group-classroom.jpg",
        quote: "Every record we keep is a promise to a giver and a child.",
        caption: "— Programme team",
      }}
    >
      <Suspense>
        <ASignIn audience="admin" />
      </Suspense>
    </AAuthFrame>
  );
}
