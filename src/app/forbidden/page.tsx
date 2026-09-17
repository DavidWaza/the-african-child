import type { Metadata } from "next";
import Link from "next/link";
import { NButton, NIcon } from "@/components/n";

export const metadata: Metadata = { title: "No access", robots: { index: false } };

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-base-50 px-4 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-red-50 text-red-500">
        <NIcon name="lock" weight="duotone" className="size-8" />
      </span>
      <h1 className="text-4xl font-semibold">This area isn&apos;t for your account</h1>
      <p className="max-w-md text-base-550">You&apos;re signed in with a different role. Head back to your own dashboard.</p>
      <NButton asChild>
        <Link href="/">Go home</Link>
      </NButton>
    </main>
  );
}
