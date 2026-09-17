"use client";

/**
 * SHARED SLICE — the one feature other features may import, like the doc's
 * audit-trail. Presentational only: it renders shared DTOs and owns no queries,
 * so the giver and admin slices each fetch their own copy.
 */
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  NAvatar,
  NBadge,
  NButton,
  NCard,
  NCardAction,
  NCardContent,
  NCardDescription,
  NCardHeader,
  NCardTitle,
  NDescriptionList,
  NEmpty,
  NEmptyDescription,
  NEmptyIcon,
  NEmptyTitle,
  NIcon,
  NLineChart,
  NSelect,
  NStatus,
} from "@/components/n";
import { classLevelLabel } from "@/lib/academics";
import type { Child, Disbursement, School, TermResult } from "@/lib/dto";
import { openAttachment } from "@/lib/files";
import { ageFrom, formatDate, formatMoney, formatNumber, ordinal } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CrChildHero({ child, actions }: { child: Child; actions?: React.ReactNode }) {
  const age = ageFrom(child.dateOfBirth);
  return (
    <div className="relative overflow-hidden rounded-3xl bg-flow-primary text-base-0">
      <div className="absolute inset-0 pattern-footer opacity-[0.07]" aria-hidden />
      <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8">
        <NAvatar name={child.fullName} src={child.photoUrl} className="size-24 text-2xl ring-4 ring-flow-secondary md:size-28" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <NStatus kind="child" status={child.status} />
            {child.performance && <NStatus kind="performance" status={child.performance} />}
          </div>
          <h1 className="text-3xl font-semibold md:text-4xl">{child.fullName}</h1>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-base-0/75">
            <span className="inline-flex items-center gap-1.5">
              <NIcon name="graduation" className="size-4" /> {classLevelLabel(child.classLevel)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <NIcon name="school" className="size-4" /> {child.schoolName}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <NIcon name="location" className="size-4" /> {child.state}
            </span>
            {age != null && <span>{age} years old</span>}
          </p>
          {child.aspiration && (
            <p className="text-sm">
              Dreams of becoming <span className="font-semibold text-flow-secondary">{child.aspiration.toLowerCase().match(/^[aeiou]/) ? "an" : "a"} {child.aspiration}</span>
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-2 md:self-start">{actions}</div>}
      </div>
    </div>
  );
}

export function CrStory({ child }: { child: Child }) {
  if (!child.story) return null;
  return (
    <NCard>
      <NCardHeader>
        <NCardTitle>{child.firstName}&apos;s story</NCardTitle>
      </NCardHeader>
      <NCardContent>
        <p className="font-display text-lg leading-relaxed text-base-600">&ldquo;{child.story}&rdquo;</p>
      </NCardContent>
    </NCard>
  );
}

const telHref = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;
const waHref = (n: string, text: string) => `https://wa.me/${n.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

export function CrFamilyContact({ child, greeting }: { child: Child; greeting?: string }) {
  const g = child.guardian;
  const message = greeting ?? `Hello ${g.fullName}, I'm one of ${child.firstName}'s sponsors with The African Child. I hope you're all well.`;
  return (
    <NCard>
      <NCardHeader>
        <NCardTitle>Family contact</NCardTitle>
        <NCardDescription>
          {g.relationship} of {child.firstName}
        </NCardDescription>
      </NCardHeader>
      <NCardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <NAvatar name={g.fullName || "Guardian"} className="size-11" />
          <div className="min-w-0">
            <p className="font-semibold text-base-900">{g.fullName || "—"}</p>
            <p className="truncate text-sm text-base-500">{g.address ?? child.state}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {g.phone && (
            <NButton asChild color="primary" variant="soft" className="justify-start">
              <a href={telHref(g.phone)}>
                <NIcon name="phone" /> Call {g.phone}
              </a>
            </NButton>
          )}
          {(g.whatsapp ?? g.phone) && (
            <NButton asChild color="success" variant="soft" className="justify-start">
              <a href={waHref(g.whatsapp ?? g.phone, message)} target="_blank" rel="noopener noreferrer">
                <NIcon name="whatsapp" /> WhatsApp
              </a>
            </NButton>
          )}
          {g.email && (
            <NButton asChild color="secondary" variant="outline" className="justify-start sm:col-span-2">
              <a href={`mailto:${g.email}?subject=${encodeURIComponent(`Hello from ${child.firstName}'s sponsor`)}`}>
                <NIcon name="email" /> {g.email}
              </a>
            </NButton>
          )}
        </div>
        <p className="flex items-start gap-2 rounded-xl bg-base-50 p-3 text-xs text-base-550">
          <NIcon name="safeguarding" className="mt-px size-4 text-accent-500" />
          Please keep contact respectful and occasional. Never send money or gifts directly — give through the programme so every naira stays accounted for.
        </p>
      </NCardContent>
    </NCard>
  );
}

export function CrSchoolCard({ school }: { school: School | null }) {
  return (
    <NCard>
      <NCardHeader>
        <NCardTitle>School</NCardTitle>
      </NCardHeader>
      <NCardContent>
        {school ? (
          <NDescriptionList
            className="sm:grid-cols-1"
            items={[
              { label: "Name", value: school.name },
              { label: "Location", value: `${school.lga ? `${school.lga}, ` : ""}${school.state}` },
              { label: "Principal", value: school.principalName },
              { label: "Ownership", value: <span className="capitalize">{school.ownership}</span> },
            ]}
          />
        ) : (
          <p className="text-sm text-base-500">No school on record.</p>
        )}
      </NCardContent>
    </NCard>
  );
}

export function CrResultsTrend({ results }: { results: TermResult[] }) {
  const points = [...results]
    .sort((a, b) => a.sortKey - b.sortKey)
    .map((r) => ({
      key: r.id,
      label: `${r.termLabel.split(" ")[0]} ${r.session.slice(2, 4)}/${r.session.slice(7, 9)}`,
      detail: `${r.termLabel}, ${r.session} · ${classLevelLabel(r.classLevel)}`,
      value: r.average,
    }));
  const first = points[0]?.value;
  const last = points.at(-1)?.value;
  const delta = first != null && last != null && points.length > 1 ? last - first : null;

  return (
    <NCard>
      <NCardHeader>
        <NCardTitle>Average score by term</NCardTitle>
        <NCardDescription>Out of 100 across all subjects</NCardDescription>
        {delta != null && (
          <NCardAction>
            <NBadge tone={delta >= 0 ? "success" : "attention"}>
              <NIcon name="performance" />
              {delta >= 0 ? "+" : ""}
              {formatNumber(delta, 1)} pts
            </NBadge>
          </NCardAction>
        )}
      </NCardHeader>
      <NCardContent>
        {points.length ? (
          <NLineChart data={points} max={100} formatValue={(v) => `${formatNumber(v, 1)}%`} formatAxis={(v) => `${v}`} valueLabel="Average score" />
        ) : (
          <p className="py-8 text-center text-sm text-base-500">Results will appear here once the first term is uploaded.</p>
        )}
      </NCardContent>
    </NCard>
  );
}

function gradeTone(grade: string) {
  if (grade.startsWith("A") || grade.startsWith("B")) return "success" as const;
  if (grade.startsWith("C")) return "info" as const;
  if (grade.startsWith("F")) return "attention" as const;
  return "pending" as const;
}

export function CrResultSheet({ result, footer }: { result: TermResult; footer?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Average", value: result.average != null ? `${formatNumber(result.average, 1)}%` : "—" },
          { label: "Position", value: result.position ? `${ordinal(result.position)}${result.classSize ? ` of ${result.classSize}` : ""}` : "—" },
          { label: "Class", value: classLevelLabel(result.classLevel) },
          { label: "Subjects", value: result.subjects.length },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-base-50 p-3">
            <p className="text-xs text-base-500">{s.label}</p>
            <p className="mt-0.5 font-semibold text-base-950 tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-base-150">
        <table className="w-full min-w-[480px] text-sm">
          <thead className="bg-base-50 text-xs text-base-500 uppercase">
            <tr>
              <th className="px-3 py-2.5 text-left font-semibold">Subject</th>
              <th className="px-3 py-2.5 text-right font-semibold">CA /40</th>
              <th className="px-3 py-2.5 text-right font-semibold">Exam /60</th>
              <th className="px-3 py-2.5 text-right font-semibold">Total</th>
              <th className="px-3 py-2.5 text-left font-semibold">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-100">
            {result.subjects.map((s) => (
              <tr key={s.subject}>
                <td className="px-3 py-2.5 font-medium text-base-900">{s.subject}</td>
                <td className="px-3 py-2.5 text-right text-base-600 tabular-nums">{s.ca}</td>
                <td className="px-3 py-2.5 text-right text-base-600 tabular-nums">{s.exam}</td>
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{s.total}</td>
                <td className="px-3 py-2.5">
                  <NBadge size="sm" tone={gradeTone(s.grade)}>
                    {s.grade} · {s.remark}
                  </NBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {result.teacherRemark && (
        <blockquote className="rounded-xl border-l-4 border-flow-secondary bg-flow-s4 p-4 text-sm text-base-600">
          <p className="mb-1 text-xs font-semibold tracking-wide text-base-500 uppercase">Teacher&apos;s remark</p>
          {result.teacherRemark}
        </blockquote>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-base-500">Uploaded {formatDate(result.uploadedAt)}</p>
        <div className="flex flex-wrap gap-2">
          {result.attachment && (
            <NButton size="sm" color="secondary" variant="outline" onClick={() => openAttachment(result.attachment!)}>
              <NIcon name="document" /> View report sheet
            </NButton>
          )}
          {footer}
        </div>
      </div>
    </div>
  );
}

export function CrResults({
  results,
  renderActions,
}: {
  results: TermResult[];
  renderActions?: (result: TermResult) => React.ReactNode;
}) {
  const [selectedId, setSelectedId] = React.useState(results[0]?.id);
  const selected = results.find((r) => r.id === selectedId) ?? results[0];

  return (
    <NCard>
      <NCardHeader>
        <NCardTitle>School results</NCardTitle>
        <NCardDescription>
          {results.length ? `${results.length} term${results.length === 1 ? "" : "s"} on record` : "No results yet"}
        </NCardDescription>
        {results.length > 1 && (
          <NCardAction>
            <NSelect value={selected?.id} onChange={(e) => setSelectedId(e.target.value)} aria-label="Choose a term" className="w-48">
              {results.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.termLabel} · {r.session}
                </option>
              ))}
            </NSelect>
          </NCardAction>
        )}
      </NCardHeader>
      <NCardContent>
        {selected ? (
          <CrResultSheet result={selected} footer={renderActions?.(selected)} />
        ) : (
          <NEmpty className="border-0 py-8">
            <NEmptyIcon name="results" />
            <NEmptyTitle>No results uploaded yet</NEmptyTitle>
            <NEmptyDescription>Report cards are uploaded by the programme team at the end of each term.</NEmptyDescription>
          </NEmpty>
        )}
      </NCardContent>
    </NCard>
  );
}

export function CrDisbursements({
  disbursements,
  total,
  action,
  renderRowAction,
}: {
  disbursements: Disbursement[];
  total: number;
  action?: React.ReactNode;
  renderRowAction?: (d: Disbursement) => React.ReactNode;
}) {
  return (
    <NCard>
      <NCardHeader>
        <NCardTitle>Where the money went</NCardTitle>
        <NCardDescription>
          {formatMoney(total)} spent across {disbursements.length} item{disbursements.length === 1 ? "" : "s"}
        </NCardDescription>
        {action && <NCardAction>{action}</NCardAction>}
      </NCardHeader>
      <NCardContent>
        {disbursements.length ? (
          <ul className="divide-y divide-base-100">
            {disbursements.map((d) => (
              <li key={d.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-500">
                  <NIcon name="disbursement" className="size-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-base-900">{d.categoryLabel}</p>
                  <p className={cn("truncate text-xs text-base-500")}>
                    {formatDate(d.spentOn)}
                    {d.note ? ` · ${d.note}` : ""}
                  </p>
                </div>
                <p className="font-semibold text-base-950 tabular-nums">{formatMoney(d.amount)}</p>
                {renderRowAction?.(d)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-6 text-center text-sm text-base-500">No spending recorded yet.</p>
        )}
      </NCardContent>
    </NCard>
  );
}

export function CrChildCard({ child, href }: { child: Child; href: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-base-150 bg-base-0 transition-[box-shadow,transform,border-color] hover:-translate-y-0.5 hover:border-accent-150 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-flow-s4">
        {child.photoUrl ? (
          <Image
            src={child.photoUrl}
            alt={child.fullName}
            fill
            sizes="(min-width: 1024px) 300px, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={child.photoUrl.startsWith("data:")}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <NAvatar name={child.fullName} className="size-20 text-2xl" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <NStatus kind="child" status={child.status} size="sm" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="font-display text-lg font-semibold text-base-950">{child.fullName}</p>
          <p className="truncate text-sm text-base-500">
            {classLevelLabel(child.classLevel)} · {child.schoolName}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-base-100 pt-3">
          {child.latestAverage != null ? (
            <span className="text-sm">
              <span className="font-semibold text-base-950 tabular-nums">{formatNumber(child.latestAverage, 1)}%</span>
              <span className="text-base-500"> latest average</span>
            </span>
          ) : (
            <span className="text-sm text-base-500">Awaiting first results</span>
          )}
          <NIcon name="forward" className="size-4 text-base-400 transition-transform group-hover:translate-x-0.5 group-hover:text-accent-500" />
        </div>
      </div>
    </Link>
  );
}
