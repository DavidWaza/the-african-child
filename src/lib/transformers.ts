/**
 * api → dto. Null-handling and derivation live here, never formatting: dates
 * and money stay raw so the component that prints them decides how.
 */
import type {
  ApiChild,
  ApiChildDetail,
  ApiContribution,
  ApiDisbursement,
  ApiMonthlyPoint,
  ApiPledge,
  ApiResult,
  ApiSchool,
  ApiUser,
} from "@/lib/api-types";
import {
  averageOf,
  disbursementLabel,
  gradeFor,
  performanceBand,
  termLabel,
  termSortKey,
} from "@/lib/academics";
import type {
  Child,
  ChildDetail,
  Contribution,
  Disbursement,
  MonthlyPoint,
  Pledge,
  School,
  SessionUserDto,
  TermResult,
} from "@/lib/dto";

export const toSessionUser = (u: ApiUser): SessionUserDto => ({
  id: u.id,
  role: u.role,
  fullName: u.full_name,
  email: u.email,
  phone: u.phone ?? null,
});

export const toChild = (c: ApiChild): Child => ({
  id: c.id,
  firstName: c.first_name,
  lastName: c.last_name,
  fullName: `${c.first_name} ${c.last_name}`.trim(),
  gender: c.gender,
  dateOfBirth: c.date_of_birth,
  photoUrl: c.photo_url || null,
  schoolId: c.school_id,
  schoolName: c.school_name ?? "—",
  classLevel: c.class_level,
  state: c.state,
  story: c.story ?? "",
  aspiration: c.aspiration ?? null,
  status: c.status,
  guardian: {
    fullName: c.guardian?.full_name ?? "",
    relationship: c.guardian?.relationship ?? "",
    phone: c.guardian?.phone ?? "",
    whatsapp: c.guardian?.whatsapp ?? null,
    email: c.guardian?.email ?? null,
    address: c.guardian?.address ?? null,
  },
  sponsorIds: c.sponsor_ids ?? [],
  latestAverage: c.latest_average ?? null,
  performance: performanceBand(c.latest_average ?? null),
  enrolledAt: c.enrolled_at,
});

export const toSchool = (s: ApiSchool): School => ({
  id: s.id,
  name: s.name,
  state: s.state,
  lga: s.lga,
  address: s.address,
  ownership: s.ownership,
  principalName: s.principal_name,
  phone: s.phone ?? null,
  email: s.email ?? null,
  childrenCount: s.children_count ?? 0,
});

export function toTermResult(r: ApiResult): TermResult {
  const subjects = (r.subjects ?? []).map((s) => {
    const total = s.ca_score + s.exam_score;
    const band = gradeFor(total);
    return { subject: s.subject, ca: s.ca_score, exam: s.exam_score, total, grade: band.grade, remark: band.remark };
  });
  const average = averageOf(r.subjects ?? []);
  return {
    id: r.id,
    childId: r.child_id,
    childName: r.child_name,
    session: r.session,
    term: r.term,
    termLabel: termLabel(r.term),
    classLevel: r.class_level,
    subjects,
    average,
    performance: performanceBand(average),
    position: r.position ?? null,
    classSize: r.class_size ?? null,
    teacherRemark: r.teacher_remark ?? null,
    attachment: r.attachment ?? null,
    uploadedAt: r.uploaded_at,
    sortKey: termSortKey(r.session, r.term),
  };
}

/** Newest first. */
export const toTermResults = (rs: ApiResult[]) => rs.map(toTermResult).sort((a, b) => b.sortKey - a.sortKey);

export const toDisbursement = (d: ApiDisbursement): Disbursement => ({
  id: d.id,
  childId: d.child_id,
  category: d.category,
  categoryLabel: disbursementLabel(d.category),
  amount: d.amount,
  spentOn: d.spent_on,
  note: d.note ?? null,
});

export const toContribution = (c: ApiContribution): Contribution => ({
  id: c.id,
  giverId: c.giver_id,
  giverName: c.giver_name,
  amount: c.amount,
  month: c.month,
  status: c.status,
  reference: c.reference,
  paidAt: c.paid_at,
});

export const toPledge = (p: ApiPledge | null): Pledge | null =>
  p ? { monthlyAmount: p.monthly_amount, status: p.status, startedAt: p.started_at, updatedAt: p.updated_at } : null;

export const toMonthlySeries = (points: ApiMonthlyPoint[]): MonthlyPoint[] =>
  (points ?? []).map((p) => ({ month: p.month, amount: p.amount }));

export function toChildDetail(d: ApiChildDetail): ChildDetail {
  const disbursements = (d.disbursements ?? [])
    .map(toDisbursement)
    .sort((a, b) => b.spentOn.localeCompare(a.spentOn));
  return {
    child: toChild(d.child),
    school: d.school ? toSchool(d.school) : null,
    results: toTermResults(d.results ?? []),
    disbursements,
    totalDisbursed: disbursements.reduce((acc, x) => acc + x.amount, 0),
    sponsors: (d.sponsors ?? []).map((s) => ({ id: s.id, fullName: s.full_name, email: s.email })),
  };
}
