"use client";

import * as React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { NIcon, NSkeleton } from "@/components/n";
import { cn } from "@/lib/utils";
import { usePublicImpact } from "../composition/use-public-impact";

const GEO_URL = "/ng.json";

/** The GeoJSON spells some states differently from our records. */
const normaliseState = (name: string) => {
  const key = name.toLowerCase().replace(/[^a-z]/g, "");
  if (key === "nassarawa") return "nasarawa";
  if (key.startsWith("fct")) return "fct";
  return key;
};

const displayName = (name: string) => (name.startsWith("FCT") ? "FCT, Abuja" : name.replace(/-/g, " "));

interface GeoFeature {
  rsmKey: string;
  properties: { name: string };
}

export function PImpactMap() {
  const { impact, isLoading } = usePublicImpact();
  const [hover, setHover] = React.useState<{ name: string; x: number; y: number } | null>(null);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const supported = React.useMemo(() => new Set((impact?.states ?? []).map(normaliseState)), [impact]);
  const isSupported = (name: string) => supported.has(normaliseState(name));

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.3fr]">
      <div className="flex flex-col gap-5">
        <p className="text-xs font-semibold tracking-[0.16em] text-accent-500 uppercase">Where we work</p>
        <h2 className="text-4xl font-semibold text-base-950 md:text-5xl">One nation, one classroom at a time</h2>
        <p className="text-lg text-base-550">
          We currently support secondary school students in{" "}
          <strong className="text-base-900">{impact ? impact.states.length : "…"} states</strong>, and we&apos;re growing wherever givers make it possible.
        </p>
        <ul className="flex flex-wrap gap-2">
          {isLoading
            ? Array.from({ length: 4 }, (_, i) => <NSkeleton key={i} className="h-8 w-24 rounded-full" />)
            : impact?.states.map((s) => (
                <li key={s} className="inline-flex items-center gap-1.5 rounded-full border border-base-150 bg-base-0 px-3 py-1.5 text-sm font-medium">
                  <span className="size-2.5 rounded-full bg-flow-secondary ring-2 ring-flow-s6" />
                  {s}
                </li>
              ))}
        </ul>
        <div className="flex flex-wrap gap-5 pt-2 text-sm text-base-550">
          <span className="inline-flex items-center gap-2">
            <span className="size-3.5 rounded-sm bg-flow-secondary" /> Children on the programme
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-3.5 rounded-sm bg-accent-100" /> Not yet — help us get there
          </span>
        </div>
      </div>

      <div
        ref={wrapRef}
        className="relative"
        onMouseMove={(e) => {
          if (!hover || !wrapRef.current) return;
          const r = wrapRef.current.getBoundingClientRect();
          setHover({ ...hover, x: e.clientX - r.left, y: e.clientY - r.top });
        }}
        onMouseLeave={() => setHover(null)}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 3300, center: [8.6, 9.2] }}
          width={800}
          height={680}
          className="h-auto w-full"
          aria-label="Map of Nigeria showing supported states"
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: GeoFeature[] }) =>
              geographies.map((geo) => {
                const name = geo.properties.name;
                const on = isSupported(name);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    tabIndex={0}
                    aria-label={`${displayName(name)}: ${on ? "supported" : "not yet supported"}`}
                    onMouseEnter={(e: React.MouseEvent) => {
                      const r = wrapRef.current?.getBoundingClientRect();
                      setHover({ name, x: e.clientX - (r?.left ?? 0), y: e.clientY - (r?.top ?? 0) });
                    }}
                    onFocus={() => setHover({ name, x: 400 * ((wrapRef.current?.clientWidth ?? 800) / 800), y: 40 })}
                    onBlur={() => setHover(null)}
                    style={{
                      default: { fill: on ? "var(--flow-secondary)" : "var(--accent-100)", stroke: "var(--base-0)", strokeWidth: 1.2, outline: "none" },
                      hover: { fill: on ? "var(--yellow-500)" : "var(--accent-150)", stroke: "var(--base-0)", strokeWidth: 1.2, outline: "none", cursor: "default" },
                      pressed: { fill: on ? "var(--yellow-500)" : "var(--accent-150)", outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        {hover && (
          <div
            role="tooltip"
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-xl border border-base-150 bg-base-0 px-3 py-2 text-sm whitespace-nowrap shadow-lg"
            style={{ left: hover.x, top: hover.y }}
          >
            <p className="font-semibold text-base-950">{displayName(hover.name)}</p>
            <p className={cn("flex items-center gap-1 text-xs", isSupported(hover.name) ? "text-green-600" : "text-base-500")}>
              <NIcon name={isSupported(hover.name) ? "complete" : "pending"} className="size-3.5" />
              {isSupported(hover.name) ? "Children on the programme" : "Not yet supported"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
