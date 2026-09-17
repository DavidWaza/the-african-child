/**
 * Academic rules shared by every slice that shows or records results.
 * The programme only supports secondary school (JSS1 – SSS3).
 */
import type { ApiClassLevel, ApiDisbursementCategory, ApiTerm } from "@/lib/api-types";
import type { CanonicalStatus } from "@/lib/status";

export const CLASS_LEVELS: { value: ApiClassLevel; label: string }[] = [
  { value: "JSS1", label: "JSS 1" },
  { value: "JSS2", label: "JSS 2" },
  { value: "JSS3", label: "JSS 3" },
  { value: "SSS1", label: "SSS 1" },
  { value: "SSS2", label: "SSS 2" },
  { value: "SSS3", label: "SSS 3" },
];

export const classLevelLabel = (level: string) => CLASS_LEVELS.find((c) => c.value === level)?.label ?? level;

export const TERMS: { value: ApiTerm; label: string }[] = [
  { value: "first", label: "First term" },
  { value: "second", label: "Second term" },
  { value: "third", label: "Third term" },
];

export const termLabel = (term: string) => TERMS.find((t) => t.value === term)?.label ?? term;

const TERM_ORDER: Record<string, number> = { first: 1, second: 2, third: 3 };

/** Chronological sort key for a (session, term) pair. `2025/2026` + `second` → 202502. */
export function termSortKey(session: string, term: string): number {
  return Number(session.slice(0, 4)) * 100 + (TERM_ORDER[term] ?? 0);
}

export function academicSessions(count = 4): string[] {
  const now = new Date();
  // The Nigerian session starts in September.
  const startYear = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
  return Array.from({ length: count }, (_, i) => `${startYear - i}/${startYear - i + 1}`);
}

export const CA_MAX = 40;
export const EXAM_MAX = 60;

const JUNIOR_SUBJECTS = [
  "English Language",
  "Mathematics",
  "Basic Science",
  "Basic Technology",
  "Social Studies",
  "Civic Education",
  "Agricultural Science",
  "Computer Studies",
];

const SENIOR_SUBJECTS = [
  "English Language",
  "Mathematics",
  "Biology",
  "Chemistry",
  "Physics",
  "Economics",
  "Civic Education",
  "Geography",
];

export const defaultSubjectsFor = (level: ApiClassLevel) =>
  level.startsWith("JSS") ? JUNIOR_SUBJECTS : SENIOR_SUBJECTS;

/** WAEC-style grading on a 100-point total. */
const GRADE_BANDS: { min: number; grade: string; remark: string }[] = [
  { min: 75, grade: "A1", remark: "Excellent" },
  { min: 70, grade: "B2", remark: "Very good" },
  { min: 65, grade: "B3", remark: "Good" },
  { min: 60, grade: "C4", remark: "Credit" },
  { min: 55, grade: "C5", remark: "Credit" },
  { min: 50, grade: "C6", remark: "Credit" },
  { min: 45, grade: "D7", remark: "Pass" },
  { min: 40, grade: "E8", remark: "Pass" },
  { min: 0, grade: "F9", remark: "Fail" },
];

export function gradeFor(total: number) {
  return GRADE_BANDS.find((band) => total >= band.min) ?? GRADE_BANDS[GRADE_BANDS.length - 1]!;
}

export function averageOf(subjects: { ca_score: number; exam_score: number }[]): number | null {
  if (!subjects.length) return null;
  const sum = subjects.reduce((acc, s) => acc + s.ca_score + s.exam_score, 0);
  return Math.round((sum / subjects.length) * 10) / 10;
}

export function performanceBand(average: number | null): CanonicalStatus<"performance"> | null {
  if (average == null) return null;
  if (average >= 70) return "excellent";
  if (average >= 55) return "good";
  if (average >= 45) return "average";
  return "needs_support";
}

export const DISBURSEMENT_CATEGORIES: { value: ApiDisbursementCategory; label: string }[] = [
  { value: "tuition", label: "Tuition & levies" },
  { value: "uniform", label: "Uniforms" },
  { value: "books", label: "Books & supplies" },
  { value: "feeding", label: "Feeding" },
  { value: "transport", label: "Transport" },
  { value: "exam_fees", label: "Exam fees" },
  { value: "other", label: "Other" },
];

export const disbursementLabel = (c: string) => DISBURSEMENT_CATEGORIES.find((d) => d.value === c)?.label ?? c;

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
  "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];
