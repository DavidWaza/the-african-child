/**
 * Shared DTOs — the shape screens want (camelCase). Produced only by
 * `transformers.ts`. A slice needing a different projection owns its own
 * narrow read model instead of widening these.
 */
import type {
  ApiAttachment,
  ApiClassLevel,
  ApiDisbursementCategory,
  ApiGender,
  ApiRole,
  ApiSchoolOwnership,
  ApiTerm,
} from "@/lib/api-types";
import type { CanonicalStatus } from "@/lib/status";

export interface Guardian {
  fullName: string;
  relationship: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
}

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: ApiGender;
  dateOfBirth: string;
  photoUrl: string | null;
  schoolId: string;
  schoolName: string;
  classLevel: ApiClassLevel;
  state: string;
  story: string;
  aspiration: string | null;
  status: string;
  guardian: Guardian;
  sponsorIds: string[];
  latestAverage: number | null;
  performance: CanonicalStatus<"performance"> | null;
  enrolledAt: string;
}

export interface School {
  id: string;
  name: string;
  state: string;
  lga: string;
  address: string;
  ownership: ApiSchoolOwnership;
  principalName: string;
  phone: string | null;
  email: string | null;
  childrenCount: number;
}

export interface SubjectScore {
  subject: string;
  ca: number;
  exam: number;
  total: number;
  grade: string;
  remark: string;
}

export interface TermResult {
  id: string;
  childId: string;
  childName: string;
  session: string;
  term: ApiTerm;
  termLabel: string;
  classLevel: ApiClassLevel;
  subjects: SubjectScore[];
  average: number | null;
  performance: CanonicalStatus<"performance"> | null;
  position: number | null;
  classSize: number | null;
  teacherRemark: string | null;
  attachment: ApiAttachment | null;
  uploadedAt: string;
  sortKey: number;
}

export interface Disbursement {
  id: string;
  childId: string;
  category: ApiDisbursementCategory;
  categoryLabel: string;
  amount: number;
  spentOn: string;
  note: string | null;
}

export interface Contribution {
  id: string;
  giverId: string;
  giverName: string;
  amount: number;
  month: string;
  status: string;
  reference: string;
  paidAt: string;
}

export interface Pledge {
  monthlyAmount: number;
  status: string;
  startedAt: string;
  updatedAt: string;
}

export interface MonthlyPoint {
  month: string;
  amount: number;
}

export interface ChildDetail {
  child: Child;
  school: School | null;
  results: TermResult[];
  disbursements: Disbursement[];
  totalDisbursed: number;
  sponsors: { id: string; fullName: string; email: string }[];
}

export interface SessionUserDto {
  id: string;
  role: ApiRole;
  fullName: string;
  email: string;
  phone: string | null;
}
