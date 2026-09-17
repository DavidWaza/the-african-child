"use client";

import * as React from "react";
import Image from "next/image";
import { NIcon } from "@/components/n";
import { STORIES, VIDEO_STORY } from "./site-content";

export function StoriesRow() {
  const scroller = React.useRef<HTMLUListElement>(null);
  const scrollBy = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * scroller.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end gap-2">
        {([-1, 1] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => scrollBy(d)}
            aria-label={d < 0 ? "Previous stories" : "Next stories"}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-base-0/20 text-base-0 transition-colors hover:bg-base-0/10"
          >
            <NIcon name={d < 0 ? "chevronLeft" : "chevronRight"} />
          </button>
        ))}
      </div>
      <ul ref={scroller} className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4 [scrollbar-width:none] md:-mx-8 md:px-8">
        {STORIES.map((s) => (
          <li key={s.name} className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]">
            <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-base-0 text-base-900">
              <div className="relative aspect-[4/3]">
                <Image src={s.image} alt={s.name} fill sizes="(min-width: 1024px) 30vw, 80vw" className="object-cover" />
                <span className="absolute bottom-3 left-3 rounded-full bg-flow-secondary px-3 py-1 text-xs font-semibold text-base-950">{s.name}</span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <NIcon name="quote" weight="fill" className="size-7 text-flow-s3" />
                <h3 className="text-2xl font-semibold">{s.title}</h3>
                <p className="text-base-550">{s.text}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Loads the YouTube player only after a click (privacy-enhanced domain). */
export function VideoStory() {
  const [playing, setPlaying] = React.useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-3xl bg-base-950 shadow-2xl">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_STORY.youtubeId}?autoplay=1&rel=0`}
          title={VIDEO_STORY.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 cursor-pointer" aria-label={`Play: ${VIDEO_STORY.title}`}>
          <Image src={VIDEO_STORY.poster} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover opacity-75 transition-transform duration-700 group-hover:scale-105" />
          <span className="absolute inset-0 bg-[radial-gradient(circle,rgb(13_58_50/0.1),rgb(13_58_50/0.7))]" />
          <span className="absolute top-1/2 left-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-flow-secondary text-base-950 shadow-[0_0_0_12px_rgb(245_184_0/0.25)] transition-transform group-hover:scale-110 md:size-24">
            <svg viewBox="0 0 24 24" className="ml-1 size-8 fill-current" aria-hidden>
              <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.77-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
            </svg>
          </span>
          <span className="absolute bottom-5 left-5 text-left text-base-0">
            <span className="block text-xs font-semibold tracking-[0.16em] text-flow-secondary uppercase">Watch</span>
            <span className="font-display text-xl font-semibold md:text-2xl">{VIDEO_STORY.title}</span>
          </span>
        </button>
      )}
    </div>
  );
}

/** A static illustration of what a giver sees — not live data. */
export function GiverPortalPreview() {
  const bars = [40, 55, 55, 70, 70, 85, 85, 100];
  return (
    <div className="relative" aria-hidden>
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-flow-s6/60 blur-2xl" />
      <div className="rotate-1 rounded-3xl border border-base-150 bg-base-0 p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-base-500">Total given so far</p>
            <p className="font-display text-3xl font-semibold">₦400,000</p>
          </div>
          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">₦50,000 / month</span>
        </div>
        <div className="mt-5 flex h-24 items-end gap-2">
          {bars.map((h, i) => (
            <span key={i} className="flex-1 rounded-t bg-chart-1" style={{ height: `${h}%`, opacity: i === bars.length - 1 ? 1 : 0.55 }} />
          ))}
        </div>
        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-base-50 p-3">
          <Image src="/assets/amina.jpg" alt="" width={44} height={44} className="size-11 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Amina Yusuf · JSS 3</p>
            <p className="text-xs text-base-500">Second term average 72.4%</p>
          </div>
          <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-600">Excellent</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <span className="flex items-center gap-1.5 rounded-xl bg-accent-50 px-3 py-2 font-medium text-accent-600">
            <NIcon name="phone" className="size-4" /> Call family
          </span>
          <span className="flex items-center gap-1.5 rounded-xl bg-flow-s4 px-3 py-2 font-medium text-base-900">
            <NIcon name="document" className="size-4" /> Report card
          </span>
        </div>
      </div>
    </div>
  );
}
