import Image from "next/image";
import Link from "next/link";
import { NIcon } from "@/components/n";

/** Split-screen frame shared by every auth page: brand panel left, form right. */
export function AAuthFrame({
  eyebrow,
  title,
  description,
  aside,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside: { quote: string; image: string; caption: string };
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-flow-primary lg:block">
        <Image src={aside.image} alt="" fill priority sizes="50vw" className="object-cover opacity-55 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-[linear-gradient(160deg,rgb(13_58_50/0.3),rgb(13_58_50/0.95)_75%)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-base-0">
          <Link href="/" className="flex w-fit items-center gap-3">
            <Image src="/assets/aci-logo-2.svg" alt="The African Child" width={56} height={56} className="h-12 w-auto" />
            <span className="font-display text-xl font-semibold">The African Child</span>
          </Link>
          <figure className="max-w-md">
            <NIcon name="quote" weight="fill" className="mb-4 size-10 text-flow-secondary" />
            <blockquote className="font-display text-3xl leading-snug">{aside.quote}</blockquote>
            <figcaption className="mt-5 text-sm text-base-0/70">{aside.caption}</figcaption>
          </figure>
        </div>
      </aside>

      <main className="flex flex-col bg-base-50">
        <div className="flex items-center justify-between px-6 py-5 lg:px-12">
          <Link href="/" className="flex items-center gap-2 lg:invisible">
            <Image src="/assets/aci-logo-2.svg" alt="The African Child" width={40} height={40} className="h-9 w-auto" />
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-base-500 hover:text-base-900">
            <NIcon name="back" className="size-4" /> Back to website
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-12 lg:px-12">
          <div className="w-full max-w-md animate-rise">
            <p className="text-xs font-semibold tracking-[0.16em] text-accent-500 uppercase">{eyebrow}</p>
            <h1 className="mt-2 text-3xl font-semibold text-base-950 md:text-4xl">{title}</h1>
            <p className="mt-2 text-base-500">{description}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
