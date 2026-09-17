/**
 * Display formatters. Two invariants:
 *
 * - One display zone. Every date is shifted into APP_TIME_ZONE.
 * - Pass raw ISO strings down to the component that prints them. A label built
 *   inside a transformer is frozen and then cached by TanStack for 5 minutes.
 *
 * Never write a bare `toLocaleDateString()` at a call site.
 */

export const APP_TIME_ZONE = "Africa/Lagos";
export const APP_LOCALE = "en-NG";
export const APP_CURRENCY = "NGN";

/**
 * A bare `YYYY-MM-DD` is a calendar date, anchored at midday so no zone shift
 * can move it to a neighbouring day. A date-time with no offset is UTC with the
 * `Z` dropped. Anything with an offset is honoured as sent.
 */
export function parseDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  let normalised = value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) normalised = `${value}T12:00:00+01:00`;
  else if (/^\d{4}-\d{2}$/.test(value)) normalised = `${value}-15T12:00:00+01:00`;
  else if (/T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(value)) normalised = `${value}Z`;

  const date = new Date(normalised);
  return Number.isNaN(date.getTime()) ? null : date;
}

function format(value: string | Date | null | undefined, options: Intl.DateTimeFormatOptions) {
  const date = parseDate(value);
  if (!date) return "—";
  return new Intl.DateTimeFormat(APP_LOCALE, { timeZone: APP_TIME_ZONE, ...options }).format(date);
}

export const formatDate = (v: string | Date | null | undefined) =>
  format(v, { day: "numeric", month: "short", year: "numeric" });

export const formatDateTime = (v: string | Date | null | undefined) =>
  format(v, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

/** `2026-03` → "Mar 2026" */
export const formatMonth = (v: string | Date | null | undefined) =>
  format(v, { month: "short", year: "numeric" });

export const formatMonthShort = (v: string | Date | null | undefined) =>
  format(v, { month: "short" });

/** Today as `YYYY-MM-DD` in the display zone. */
export function todayIso(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: APP_TIME_ZONE }).format(new Date());
}

/** The current month as `YYYY-MM` in the display zone. */
export function currentMonthKey(): string {
  return todayIso().slice(0, 7);
}

export function ageFrom(dateOfBirth: string): number | null {
  const dob = parseDate(dateOfBirth);
  if (!dob) return null;
  const [y, m, d] = todayIso().split("-").map(Number);
  let age = y - dob.getFullYear();
  if (m < dob.getMonth() + 1 || (m === dob.getMonth() + 1 && d < dob.getDate())) age -= 1;
  return age;
}

export function formatMoney(amount: number | null | undefined, opts: { compact?: boolean } = {}) {
  if (amount == null || Number.isNaN(amount)) return "—";
  return new Intl.NumberFormat(APP_LOCALE, {
    style: "currency",
    currency: APP_CURRENCY,
    maximumFractionDigits: 0,
    notation: opts.compact ? "compact" : "standard",
  }).format(amount);
}

export function formatNumber(value: number | null | undefined, digits = 0) {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat(APP_LOCALE, { maximumFractionDigits: digits }).format(value);
}

export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}
