/**
 * The wire contract — raw backend shapes, snake_case, exactly as sent.
 * The mock backend implements this; a real API must too.
 * Screens never read these directly: transformers map them to camelCase DTOs.
 */

export type ApiRole = "admin" | "giver";

export interface ApiUser {
  id: string;
  role: ApiRole;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

export interface ApiSession {
  token: string;
  user: ApiUser;
}

export type ApiSchoolOwnership = "public" | "private" | "mission";

export interface ApiSchool {
  id: string;
  name: string;
  state: string;
  lga: string;
  address: string;
  ownership: ApiSchoolOwnership;
  principal_name: string;
  phone: string | null;
  email: string | null;
  children_count: number;
  created_at: string;
}

export interface ApiGuardian {
  full_name: string;
  relationship: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
}

export type ApiClassLevel = "JSS1" | "JSS2" | "JSS3" | "SSS1" | "SSS2" | "SSS3";
export type ApiGender = "female" | "male";

export interface ApiChild {
  id: string;
  first_name: string;
  last_name: string;
  gender: ApiGender;
  date_of_birth: string;
  photo_url: string | null;
  school_id: string;
  school_name: string;
  class_level: ApiClassLevel;
  state: string;
  story: string;
  aspiration: string | null;
  status: string;
  guardian: ApiGuardian;
  sponsor_ids: string[];
  latest_average: number | null;
  enrolled_at: string;
  created_at: string;
}

export type ApiTerm = "first" | "second" | "third";

export interface ApiSubjectScore {
  subject: string;
  ca_score: number;
  exam_score: number;
}

export interface ApiAttachment {
  file_name: string;
  mime_type: string;
  data_url: string;
}

export interface ApiResult {
  id: string;
  child_id: string;
  child_name: string;
  session: string;
  term: ApiTerm;
  class_level: ApiClassLevel;
  subjects: ApiSubjectScore[];
  position: number | null;
  class_size: number | null;
  teacher_remark: string | null;
  attachment: ApiAttachment | null;
  uploaded_at: string;
  uploaded_by: string;
}

export type ApiDisbursementCategory = "tuition" | "uniform" | "books" | "feeding" | "transport" | "exam_fees" | "other";

export interface ApiDisbursement {
  id: string;
  child_id: string;
  category: ApiDisbursementCategory;
  amount: number;
  spent_on: string;
  note: string | null;
  created_at: string;
}

export interface ApiPledge {
  giver_id: string;
  monthly_amount: number;
  status: string;
  started_at: string;
  updated_at: string;
}

export interface ApiContribution {
  id: string;
  giver_id: string;
  giver_name: string;
  amount: number;
  month: string;
  status: string;
  reference: string;
  paid_at: string;
}

export interface ApiMonthlyPoint {
  month: string;
  amount: number;
}

export interface ApiGiverOverview {
  total_contributed: number;
  contributions_count: number;
  months_active: number;
  this_month_paid: boolean;
  pledge: ApiPledge | null;
  children_count: number;
  children_average: number | null;
  total_disbursed_to_children: number;
  monthly_series: ApiMonthlyPoint[];
  recent_results: ApiResult[];
}

export interface ApiChildDetail {
  child: ApiChild;
  school: ApiSchool | null;
  results: ApiResult[];
  disbursements: ApiDisbursement[];
  sponsors: Pick<ApiUser, "id" | "full_name" | "email">[];
}

export interface ApiGiverRow {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  monthly_amount: number | null;
  pledge_status: string | null;
  total_contributed: number;
  children_count: number;
  joined_at: string;
}

export interface ApiAdminOverview {
  children_total: number;
  children_active: number;
  schools_total: number;
  givers_total: number;
  total_contributed: number;
  this_month_contributed: number;
  monthly_pledged: number;
  total_disbursed: number;
  children_without_sponsor: number;
  children_without_results: number;
  monthly_series: ApiMonthlyPoint[];
  recent_results: ApiResult[];
  recent_contributions: ApiContribution[];
}

export interface ApiPublicImpact {
  children_supported: number;
  schools_partnered: number;
  states: string[];
  givers_count: number;
  total_contributed: number;
  total_disbursed: number;
  average_score: number | null;
  results_published: number;
  disbursed_by_category: { category: ApiDisbursementCategory; amount: number }[];
}
