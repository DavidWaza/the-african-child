import { Suspense } from "react";
import type { Metadata } from "next";
import { AAuthFrame } from "@/features/auth/session/ui/a-auth-frame";
import { ASignIn } from "@/features/auth/session/ui/a-sign-in";

export const metadata: Metadata = { title: "Giver sign in" };

export default function GiverLoginPage() {
  return (
    <AAuthFrame
      eyebrow="Giver portal"
      title="Welcome back"
      description="Sign in to see your giving, the children you support and their latest results."
      aside={{
        image: "/assets/smiling-kids.jpg",
        quote: "Seeing Amina's report card every term reminds me exactly why I give.",
        caption: "— Ngozi, monthly giver",
      }}
    >
      <Suspense>
        <ASignIn audience="giver" />
      </Suspense>
    </AAuthFrame>
  );
}
