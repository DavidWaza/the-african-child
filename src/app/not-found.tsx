import Link from "next/link";
import { NButton } from "@/components/n";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-flow-primary px-4 text-center text-base-0">
      <p className="font-display text-8xl font-semibold text-flow-secondary">404</p>
      <h1 className="text-3xl font-semibold">We couldn&apos;t find that page</h1>
      <p className="max-w-md text-base-0/75">It may have moved. Let&apos;s get you back to somewhere useful.</p>
      <NButton asChild color="gold" size="lg">
        <Link href="/">Back to home</Link>
      </NButton>
    </main>
  );
}
