"use client";

/**
 * Single-series charts. One hue (`--chart-1`, validated against the light
 * surface), so no legend — the card title names the series. Every mark has a
 * hover/focus tooltip, and a table view is one click away.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChartPoint {
  key: string;
  label: string;
  value: number | null;
  /** Full label for the tooltip and table. */
  detail?: string;
}

interface ChartProps {
  data: ChartPoint[];
  formatValue: (v: number) => string;
  formatAxis?: (v: number) => string;
  height?: number;
  /** Fixed y maximum (e.g. 100 for scores). Otherwise a nice ceiling is derived. */
  max?: number;
  valueLabel: string;
  className?: string;
}

function niceCeiling(v: number) {
  if (v <= 0) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / exp;
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return nice * exp;
}

function useWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [width, setWidth] = React.useState(0);
  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry!.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

function ChartFrame({
  data,
  formatValue,
  valueLabel,
  className,
  children,
}: Pick<ChartProps, "data" | "formatValue" | "valueLabel" | "className"> & { children: React.ReactNode }) {
  const [showTable, setShowTable] = React.useState(false);
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {showTable ? (
        <div className="max-h-72 overflow-auto rounded-xl border border-base-150">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-base-50 text-xs text-base-500 uppercase">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Period</th>
                <th className="px-3 py-2 text-right font-semibold">{valueLabel}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-100">
              {data.map((d) => (
                <tr key={d.key}>
                  <td className="px-3 py-2">{d.detail ?? d.label}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{d.value == null ? "—" : formatValue(d.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        children
      )}
      <button
        type="button"
        onClick={() => setShowTable((s) => !s)}
        className="self-end cursor-pointer text-xs font-medium text-base-500 underline-offset-2 hover:text-base-900 hover:underline"
      >
        {showTable ? "Show chart" : "View as table"}
      </button>
    </div>
  );
}

function Tooltip({ point, formatValue, x, y }: { point: ChartPoint; formatValue: (v: number) => string; x: number; y: number }) {
  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-base-150 bg-base-0 px-2.5 py-1.5 text-xs whitespace-nowrap shadow-lg"
      style={{ left: x, top: y - 8 }}
    >
      <p className="text-base-500">{point.detail ?? point.label}</p>
      <p className="font-semibold text-base-950 tabular-nums">{point.value == null ? "No data" : formatValue(point.value)}</p>
    </div>
  );
}

const AXIS_W = 52;
const X_AXIS_H = 24;

export function NColumnChart({ data, formatValue, formatAxis = formatValue, height = 220, max, valueLabel, className }: ChartProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = React.useState<number | null>(null);
  const top = max ?? niceCeiling(Math.max(0, ...data.map((d) => d.value ?? 0)));
  const ticks = [0, 0.5, 1].map((t) => t * top);
  const plotH = height - X_AXIS_H;
  const plotW = Math.max(0, width - AXIS_W);
  const slot = data.length ? plotW / data.length : 0;
  const barW = Math.max(4, Math.min(36, slot * 0.56));

  return (
    <ChartFrame data={data} formatValue={formatValue} valueLabel={valueLabel} className={className}>
      <div ref={ref} className="relative w-full" style={{ height }} onMouseLeave={() => setActive(null)}>
        {width > 0 && (
          <svg width={width} height={height} role="img" aria-label={`${valueLabel} by period`} className="overflow-visible">
            {ticks.map((t) => {
              const y = plotH - (t / top) * plotH;
              return (
                <g key={t}>
                  <line x1={AXIS_W} x2={width} y1={y} y2={y} stroke="var(--base-150)" strokeDasharray={t === 0 ? undefined : "3 4"} />
                  <text x={AXIS_W - 8} y={y} dy="0.32em" textAnchor="end" className="fill-base-500 text-[11px] tabular-nums">
                    {formatAxis(t)}
                  </text>
                </g>
              );
            })}
            {data.map((d, i) => {
              const v = d.value ?? 0;
              const h = Math.max(v > 0 ? 3 : 0, (v / top) * plotH);
              const x = AXIS_W + i * slot + (slot - barW) / 2;
              const r = Math.min(4, barW / 2, h);
              const isActive = active === i;
              return (
                <g key={d.key}>
                  {h > 0 && (
                    <path
                      d={`M${x},${plotH} V${plotH - h + r} Q${x},${plotH - h} ${x + r},${plotH - h} H${x + barW - r} Q${x + barW},${plotH - h} ${x + barW},${plotH - h + r} V${plotH} Z`}
                      fill="var(--chart-1)"
                      opacity={active == null || isActive ? 1 : 0.45}
                      className="transition-opacity"
                    />
                  )}
                  <text x={x + barW / 2} y={height - 6} textAnchor="middle" className={cn("text-[11px]", isActive ? "fill-base-900 font-semibold" : "fill-base-500")}>
                    {d.label}
                  </text>
                  {/* Hit target: the full column slot, larger than the mark. */}
                  <rect
                    x={AXIS_W + i * slot}
                    y={0}
                    width={slot}
                    height={plotH}
                    fill="transparent"
                    tabIndex={0}
                    aria-label={`${d.detail ?? d.label}: ${d.value == null ? "no data" : formatValue(d.value)}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    className="cursor-default outline-none"
                  />
                </g>
              );
            })}
          </svg>
        )}
        {active != null && data[active] && (
          <Tooltip
            point={data[active]!}
            formatValue={formatValue}
            x={AXIS_W + active * slot + slot / 2}
            y={plotH - ((data[active]!.value ?? 0) / top) * plotH}
          />
        )}
      </div>
    </ChartFrame>
  );
}

export function NLineChart({ data, formatValue, formatAxis = formatValue, height = 220, max, valueLabel, className }: ChartProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = React.useState<number | null>(null);
  const top = max ?? niceCeiling(Math.max(0, ...data.map((d) => d.value ?? 0)));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * top);
  const plotH = height - X_AXIS_H;
  const padX = 20;
  const plotW = Math.max(0, width - AXIS_W - padX * 2);
  const xAt = (i: number) => AXIS_W + padX + (data.length > 1 ? (i / (data.length - 1)) * plotW : plotW / 2);
  const yAt = (v: number) => plotH - (v / top) * plotH;

  const segments: string[] = [];
  let current = "";
  data.forEach((d, i) => {
    if (d.value == null) {
      if (current) segments.push(current);
      current = "";
      return;
    }
    current += `${current ? "L" : "M"}${xAt(i)},${yAt(d.value)} `;
  });
  if (current) segments.push(current);

  const onMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let nearest = 0;
    data.forEach((_, i) => {
      if (Math.abs(xAt(i) - x) < Math.abs(xAt(nearest) - x)) nearest = i;
    });
    setActive(nearest);
  };

  return (
    <ChartFrame data={data} formatValue={formatValue} valueLabel={valueLabel} className={className}>
      <div ref={ref} className="relative w-full" style={{ height }} onMouseMove={onMove} onMouseLeave={() => setActive(null)}>
        {width > 0 && (
          <svg width={width} height={height} role="img" aria-label={`${valueLabel} over time`} className="overflow-visible">
            {ticks.map((t) => (
              <g key={t}>
                <line x1={AXIS_W} x2={width} y1={yAt(t)} y2={yAt(t)} stroke="var(--base-150)" strokeDasharray={t === 0 ? undefined : "3 4"} />
                <text x={AXIS_W - 8} y={yAt(t)} dy="0.32em" textAnchor="end" className="fill-base-500 text-[11px] tabular-nums">
                  {formatAxis(t)}
                </text>
              </g>
            ))}
            {active != null && <line x1={xAt(active)} x2={xAt(active)} y1={0} y2={plotH} stroke="var(--base-400)" strokeDasharray="2 3" />}
            {segments.map((d) => (
              <path key={d} d={d} fill="none" stroke="var(--chart-1)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            ))}
            {data.map((d, i) => (
              <g key={d.key}>
                {d.value != null && (
                  <circle
                    cx={xAt(i)}
                    cy={yAt(d.value)}
                    r={active === i ? 6 : 4.5}
                    fill="var(--chart-1)"
                    stroke="var(--base-0)"
                    strokeWidth={2}
                    tabIndex={0}
                    aria-label={`${d.detail ?? d.label}: ${formatValue(d.value)}`}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    className="outline-none"
                  />
                )}
                <text x={xAt(i)} y={height - 6} textAnchor="middle" className={cn("text-[11px]", active === i ? "fill-base-900 font-semibold" : "fill-base-500")}>
                  {d.label}
                </text>
              </g>
            ))}
          </svg>
        )}
        {active != null && data[active] && (
          <Tooltip point={data[active]!} formatValue={formatValue} x={xAt(active)} y={data[active]!.value == null ? plotH / 2 : yAt(data[active]!.value!)} />
        )}
      </div>
    </ChartFrame>
  );
}
