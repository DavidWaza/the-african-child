import Image from "next/image";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

const TONES = ["bg-accent-100 text-accent-600", "bg-flow-s6 text-base-900", "bg-red-100 text-red-600", "bg-green-100 text-green-600"];

export function NAvatar({ name, src, className }: { name: string; src?: string | null; className?: string }) {
  const tone = TONES[(name.charCodeAt(0) + name.length) % TONES.length];
  return (
    <span
      data-slot="avatar"
      className={cn(
        "relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold ring-2 ring-base-0",
        !src && tone,
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={name} fill sizes="160px" className="object-cover" unoptimized={src.startsWith("data:")} />
      ) : (
        <span className="text-[0.8em]" aria-label={name}>
          {initials(name)}
        </span>
      )}
    </span>
  );
}
