/**
 * MOCK BACKEND router. Implements the wire contract in `@/lib/api-types` with
 * the same paths a real API would expose, answers in the `ApiResponse`
 * envelope, and fakes latency — without it the loading states never render.
 *
 * Refusals come back as `status: false` on a "200", exactly like the real API,
 * so the unwrap discipline is exercised in development.
 */
import type {
  ApiAdminOverview,
  ApiChild,
  ApiChildDetail,
  ApiContribution,
  ApiGiverOverview,
  ApiGiverRow,
  ApiMonthlyPoint,
  ApiPublicImpact,
  ApiResult,
  ApiSchool,
  ApiSession,
  ApiUser,
} from "@/lib/api-types";
import { averageOf, termSortKey } from "@/lib/academics";
import type { ApiResponse, PaginationMeta } from "@/lib/http/envelope";
import {
  loadDb,
  saveDb,
  uid,
  type ChildRec,
  type Db,
  type DisbursementRec,
  type ResultRec,
  type SchoolRec,
  type UserRec,
} from "./db";

export { DEMO_ACCOUNTS, resetDb } from "./db";

const MOCK_LIST_LATENCY_MS = 400;
const MOCK_MUTATION_LATENCY_MS = 650;

type Method = "GET" | "POST" | "PUT" | "DELETE";
type Body = Record<string, unknown>;

interface Ctx {
  db: Db;
  user: UserRec | null;
  params: Record<string, string>;
  query: URLSearchParams;
  body: Body;
}

type Handler = (ctx: Ctx) => ApiResponse<unknown>;

const ok = <T>(data: T, meta?: PaginationMeta): ApiResponse<T> => ({ status: true, data, meta });
const fail = (message: string): ApiResponse<null> => ({ status: false, data: null, message });

class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

/* --------------------------------------------------------------- helpers -- */

const publicUser = (u: UserRec): ApiUser => ({
  id: u.id,
  role: u.role,
  full_name: u.full_name,
  email: u.email,
  phone: u.phone,
  created_at: u.created_at,
});

const token = (u: UserRec) => `mock.${u.id}`;

function requireRole(ctx: Ctx, role: UserRec["role"]): UserRec {
  if (!ctx.user) throw new HttpError(401, "Your session has ended. Please sign in again.");
  if (ctx.user.role !== role) throw new HttpError(403, "You don't have access to this.");
  return ctx.user;
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const num = (v: unknown) => (typeof v === "number" ? v : Number(v));

function latestAverage(db: Db, childId: string): number | null {
  const latest = db.results
    .filter((r) => r.child_id === childId)
    .sort((a, b) => termSortKey(b.session, b.term) - termSortKey(a.session, a.term))[0];
  return latest ? averageOf(latest.subjects) : null;
}

function childOut(db: Db, c: ChildRec): ApiChild {
  return {
    ...c,
    school_name: db.schools.find((s) => s.id === c.school_id)?.name ?? "—",
    latest_average: latestAverage(db, c.id),
  };
}

function schoolOut(db: Db, s: SchoolRec): ApiSchool {
  return { ...s, children_count: db.children.filter((c) => c.school_id === s.id).length };
}

function resultOut(db: Db, r: ResultRec): ApiResult {
  const c = db.children.find((x) => x.id === r.child_id);
  return { ...r, child_name: c ? `${c.first_name} ${c.last_name}` : "—" };
}

function contributionOut(db: Db, c: Db["contributions"][number]): ApiContribution {
  return { ...c, giver_name: db.users.find((u) => u.id === c.giver_id)?.full_name ?? "—" };
}

function childDetail(db: Db, c: ChildRec): ApiChildDetail {
  const school = db.schools.find((s) => s.id === c.school_id);
  return {
    child: childOut(db, c),
    school: school ? schoolOut(db, school) : null,
    results: db.results.filter((r) => r.child_id === c.id).map((r) => resultOut(db, r)),
    disbursements: db.disbursements.filter((d) => d.child_id === c.id),
    sponsors: db.users
      .filter((u) => c.sponsor_ids.includes(u.id))
      .map((u) => ({ id: u.id, full_name: u.full_name, email: u.email })),
  };
}

function monthlySeries(contributions: Db["contributions"], months = 9): ApiMonthlyPoint[] {
  const now = new Date();
  return Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const amount = contributions
      .filter((c) => c.month === month && c.status === "paid")
      .reduce((acc, c) => acc + c.amount, 0);
    return { month, amount };
  });
}

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function paginate<T>(items: T[], query: URLSearchParams): { page: T[]; meta: PaginationMeta } {
  const page = Math.max(1, Number(query.get("page") ?? 1));
  const limit = Math.max(1, Number(query.get("limit") ?? 10));
  const total = items.length;
  return {
    page: items.slice((page - 1) * limit, page * limit),
    meta: { page, limit, total, total_pages: Math.max(1, Math.ceil(total / limit)) },
  };
}

function validateChild(body: Body, db: Db): string | null {
  if (!str(body.first_name) || !str(body.last_name)) return "The child's first and last name are required.";
  if (!db.schools.some((s) => s.id === body.school_id)) return "Choose a school from the list.";
  if (!/^(JSS|SSS)[1-3]$/.test(str(body.class_level))) return "Only secondary school classes (JSS1 – SSS3) are supported.";
  const guardian = body.guardian as Body | undefined;
  if (!guardian || !str(guardian.full_name) || !str(guardian.phone)) return "The family contact needs a name and phone number.";
  return null;
}

function childFromBody(body: Body, db: Db, existing?: ChildRec): ChildRec {
  const g = body.guardian as Body;
  const school = db.schools.find((s) => s.id === body.school_id)!;
  const sponsorIds = Array.isArray(body.sponsor_ids)
    ? (body.sponsor_ids as string[]).filter((id) => db.users.some((u) => u.id === id && u.role === "giver"))
    : (existing?.sponsor_ids ?? []);
  return {
    id: existing?.id ?? uid("chd"),
    first_name: str(body.first_name),
    last_name: str(body.last_name),
    gender: body.gender === "male" ? "male" : "female",
    date_of_birth: str(body.date_of_birth),
    photo_url: (body.photo_url as string | null) ?? null,
    school_id: school.id,
    class_level: str(body.class_level) as ChildRec["class_level"],
    state: school.state,
    story: str(body.story),
    aspiration: str(body.aspiration) || null,
    // A matched child is active; an unmatched one waits for review.
    status: (() => {
      const s = str(body.status) || existing?.status || "pending_review";
      return s === "pending_review" && sponsorIds.length ? "active" : s;
    })(),
    guardian: {
      full_name: str(g.full_name),
      relationship: str(g.relationship) || "Guardian",
      phone: str(g.phone),
      whatsapp: str(g.whatsapp) || null,
      email: str(g.email) || null,
      address: str(g.address) || null,
    },
    sponsor_ids: sponsorIds,
    enrolled_at: existing?.enrolled_at ?? new Date().toISOString().slice(0, 10),
    created_at: existing?.created_at ?? new Date().toISOString(),
  };
}

function validateSchool(body: Body): string | null {
  if (!str(body.name)) return "The school name is required.";
  if (!str(body.state)) return "Choose the state the school is in.";
  if (!/secondary|college|grammar|high|academy|comprehensive/i.test(str(body.name)) && body.confirm_secondary !== true) {
    return "Confirm this is a secondary school — the programme only supports secondary education.";
  }
  return null;
}

function schoolFromBody(body: Body, existing?: SchoolRec): SchoolRec {
  return {
    id: existing?.id ?? uid("sch"),
    name: str(body.name),
    state: str(body.state),
    lga: str(body.lga),
    address: str(body.address),
    ownership: (["public", "private", "mission"].includes(str(body.ownership)) ? str(body.ownership) : "public") as SchoolRec["ownership"],
    principal_name: str(body.principal_name),
    phone: str(body.phone) || null,
    email: str(body.email) || null,
    created_at: existing?.created_at ?? new Date().toISOString(),
  };
}

/* ---------------------------------------------------------------- routes -- */

const routes: Array<[Method, string, Handler]> = [
  // ── auth ────────────────────────────────────────────────────────────────
  ["POST", "/auth/login", ({ db, body }) => {
    const email = str(body.email).toLowerCase();
    const user = db.users.find((u) => u.email.toLowerCase() === email);
    if (!user || user.password !== body.password) return fail("That email and password don't match an account.");
    if (body.audience && body.audience !== user.role) {
      return fail(user.role === "admin" ? "Administrators sign in from the admin portal." : "This account is a giver account. Use the giver sign-in.");
    }
    return ok<ApiSession>({ token: token(user), user: publicUser(user) });
  }],

  ["POST", "/auth/register", ({ db, body }) => {
    const email = str(body.email).toLowerCase();
    if (!str(body.full_name)) return fail("Tell us your full name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return fail("Enter a valid email address.");
    if (str(body.password).length < 8) return fail("Use a password of at least 8 characters.");
    if (db.users.some((u) => u.email.toLowerCase() === email)) return fail("An account with this email already exists. Sign in instead.");
    const amount = num(body.monthly_amount);
    if (!Number.isFinite(amount) || amount < 1000) return fail("The minimum monthly pledge is ₦1,000.");
    const user: UserRec = {
      id: uid("usr"),
      role: "giver",
      full_name: str(body.full_name),
      email,
      phone: str(body.phone) || null,
      password: str(body.password),
      created_at: new Date().toISOString(),
    };
    db.users.push(user);
    db.pledges.push({
      giver_id: user.id,
      monthly_amount: amount,
      status: "active",
      started_at: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString(),
    });
    saveDb(db);
    return ok<ApiSession>({ token: token(user), user: publicUser(user) });
  }],

  // ── public ──────────────────────────────────────────────────────────────
  ["GET", "/public/impact", ({ db }) => {
    const supported = db.children.filter((c) => c.status === "active" || c.status === "graduated");
    const averages = supported.map((c) => latestAverage(db, c.id)).filter((a): a is number => a != null);
    const byCategory = new Map<string, number>();
    db.disbursements.forEach((d) => byCategory.set(d.category, (byCategory.get(d.category) ?? 0) + d.amount));
    return ok<ApiPublicImpact>({
      children_supported: supported.length,
      schools_partnered: new Set(supported.map((c) => c.school_id)).size,
      states: [...new Set(supported.map((c) => c.state))].sort(),
      givers_count: db.users.filter((u) => u.role === "giver").length,
      total_contributed: db.contributions.filter((c) => c.status === "paid").reduce((a, c) => a + c.amount, 0),
      total_disbursed: db.disbursements.reduce((a, d) => a + d.amount, 0),
      average_score: averages.length ? Math.round((averages.reduce((a, b) => a + b, 0) / averages.length) * 10) / 10 : null,
      results_published: db.results.length,
      disbursed_by_category: [...byCategory.entries()]
        .map(([category, amount]) => ({ category: category as DisbursementRec["category"], amount }))
        .sort((a, b) => b.amount - a.amount),
    });
  }],

  // ── giver ───────────────────────────────────────────────────────────────
  ["GET", "/giver/overview", (ctx) => {
    const me = requireRole(ctx, "giver");
    const { db } = ctx;
    const mine = db.contributions.filter((c) => c.giver_id === me.id);
    const paid = mine.filter((c) => c.status === "paid");
    const children = db.children.filter((c) => c.sponsor_ids.includes(me.id));
    const childIds = new Set(children.map((c) => c.id));
    const averages = children.map((c) => latestAverage(db, c.id)).filter((a): a is number => a != null);
    return ok<ApiGiverOverview>({
      total_contributed: paid.reduce((a, c) => a + c.amount, 0),
      contributions_count: paid.length,
      months_active: new Set(paid.map((c) => c.month)).size,
      this_month_paid: paid.some((c) => c.month === currentMonth()),
      pledge: db.pledges.find((p) => p.giver_id === me.id) ?? null,
      children_count: children.length,
      children_average: averages.length ? Math.round((averages.reduce((a, b) => a + b, 0) / averages.length) * 10) / 10 : null,
      total_disbursed_to_children: db.disbursements.filter((d) => childIds.has(d.child_id)).reduce((a, d) => a + d.amount, 0),
      monthly_series: monthlySeries(mine),
      recent_results: db.results
        .filter((r) => childIds.has(r.child_id))
        .sort((a, b) => b.uploaded_at.localeCompare(a.uploaded_at) || termSortKey(b.session, b.term) - termSortKey(a.session, a.term))
        .slice(0, 5)
        .map((r) => resultOut(db, r)),
    });
  }],

  ["GET", "/giver/contributions", (ctx) => {
    const me = requireRole(ctx, "giver");
    const rows = ctx.db.contributions
      .filter((c) => c.giver_id === me.id)
      .sort((a, b) => b.month.localeCompare(a.month))
      .map((c) => contributionOut(ctx.db, c));
    return ok(rows);
  }],

  ["POST", "/giver/contributions", (ctx) => {
    const me = requireRole(ctx, "giver");
    const { db, body } = ctx;
    const month = str(body.month) || currentMonth();
    const amount = num(body.amount);
    if (!Number.isFinite(amount) || amount < 1000) return fail("The minimum contribution is ₦1,000.");
    if (db.contributions.some((c) => c.giver_id === me.id && c.month === month && c.status === "paid")) {
      return fail("You've already given for this month. Thank you!");
    }
    const row = {
      id: uid("ctb"),
      giver_id: me.id,
      amount,
      month,
      status: "paid",
      reference: `TAC-${month.replace("-", "")}-${uid("").slice(1, 6).toUpperCase()}`,
      paid_at: new Date().toISOString(),
    };
    db.contributions.push(row);
    saveDb(db);
    return ok(contributionOut(db, row));
  }],

  ["GET", "/giver/pledge", (ctx) => {
    const me = requireRole(ctx, "giver");
    return ok(ctx.db.pledges.find((p) => p.giver_id === me.id) ?? null);
  }],

  ["PUT", "/giver/pledge", (ctx) => {
    const me = requireRole(ctx, "giver");
    const { db, body } = ctx;
    const amount = num(body.monthly_amount);
    if (!Number.isFinite(amount) || amount < 1000) return fail("The minimum monthly pledge is ₦1,000.");
    const status = ["active", "paused", "cancelled"].includes(str(body.status)) ? str(body.status) : "active";
    const existing = db.pledges.find((p) => p.giver_id === me.id);
    const now = new Date().toISOString();
    if (existing) Object.assign(existing, { monthly_amount: amount, status, updated_at: now });
    else db.pledges.push({ giver_id: me.id, monthly_amount: amount, status, started_at: now.slice(0, 10), updated_at: now });
    saveDb(db);
    return ok(db.pledges.find((p) => p.giver_id === me.id)!);
  }],

  ["GET", "/giver/children", (ctx) => {
    const me = requireRole(ctx, "giver");
    return ok(ctx.db.children.filter((c) => c.sponsor_ids.includes(me.id)).map((c) => childOut(ctx.db, c)));
  }],

  ["GET", "/giver/children/:id", (ctx) => {
    const me = requireRole(ctx, "giver");
    const child = ctx.db.children.find((c) => c.id === ctx.params.id);
    if (!child || !child.sponsor_ids.includes(me.id)) throw new HttpError(404, "We couldn't find that child among the children you support.");
    const detail = childDetail(ctx.db, child);
    // Givers see co-sponsor names only, never their contact details.
    detail.sponsors = detail.sponsors.map((s) => ({ ...s, email: s.id === me.id ? s.email : "" }));
    return ok(detail);
  }],

  // ── admin ───────────────────────────────────────────────────────────────
  ["GET", "/admin/overview", (ctx) => {
    requireRole(ctx, "admin");
    const { db } = ctx;
    const paid = db.contributions.filter((c) => c.status === "paid");
    const withResults = new Set(db.results.map((r) => r.child_id));
    return ok<ApiAdminOverview>({
      children_total: db.children.length,
      children_active: db.children.filter((c) => c.status === "active").length,
      schools_total: db.schools.length,
      givers_total: db.users.filter((u) => u.role === "giver").length,
      total_contributed: paid.reduce((a, c) => a + c.amount, 0),
      this_month_contributed: paid.filter((c) => c.month === currentMonth()).reduce((a, c) => a + c.amount, 0),
      monthly_pledged: db.pledges.filter((p) => p.status === "active").reduce((a, p) => a + p.monthly_amount, 0),
      total_disbursed: db.disbursements.reduce((a, d) => a + d.amount, 0),
      children_without_sponsor: db.children.filter((c) => c.status !== "withdrawn" && !c.sponsor_ids.length).length,
      children_without_results: db.children.filter((c) => c.status === "active" && !withResults.has(c.id)).length,
      monthly_series: monthlySeries(db.contributions),
      recent_results: [...db.results].sort((a, b) => b.uploaded_at.localeCompare(a.uploaded_at)).slice(0, 5).map((r) => resultOut(db, r)),
      recent_contributions: [...paid].sort((a, b) => b.paid_at.localeCompare(a.paid_at)).slice(0, 6).map((c) => contributionOut(db, c)),
    });
  }],

  ["GET", "/admin/children", (ctx) => {
    requireRole(ctx, "admin");
    const { db, query } = ctx;
    const search = (query.get("search") ?? "").toLowerCase();
    const status = query.get("status");
    const schoolId = query.get("school_id");
    const rows = db.children
      .filter((c) => !search || `${c.first_name} ${c.last_name} ${c.guardian.full_name}`.toLowerCase().includes(search))
      .filter((c) => !status || c.status === status)
      .filter((c) => !schoolId || c.school_id === schoolId)
      .sort((a, b) => a.first_name.localeCompare(b.first_name))
      .map((c) => childOut(db, c));
    if (query.get("all") === "true") return ok(rows);
    const { page, meta } = paginate(rows, query);
    return ok(page, meta);
  }],

  ["POST", "/admin/children", (ctx) => {
    requireRole(ctx, "admin");
    const error = validateChild(ctx.body, ctx.db);
    if (error) return fail(error);
    const child = childFromBody(ctx.body, ctx.db);
    ctx.db.children.push(child);
    saveDb(ctx.db);
    return ok(childOut(ctx.db, child));
  }],

  ["GET", "/admin/children/:id", (ctx) => {
    requireRole(ctx, "admin");
    const child = ctx.db.children.find((c) => c.id === ctx.params.id);
    if (!child) throw new HttpError(404, "That child record doesn't exist.");
    return ok(childDetail(ctx.db, child));
  }],

  ["PUT", "/admin/children/:id", (ctx) => {
    requireRole(ctx, "admin");
    const index = ctx.db.children.findIndex((c) => c.id === ctx.params.id);
    if (index < 0) throw new HttpError(404, "That child record doesn't exist.");
    const error = validateChild(ctx.body, ctx.db);
    if (error) return fail(error);
    ctx.db.children[index] = childFromBody(ctx.body, ctx.db, ctx.db.children[index]);
    saveDb(ctx.db);
    return ok(childOut(ctx.db, ctx.db.children[index]!));
  }],

  ["DELETE", "/admin/children/:id", (ctx) => {
    requireRole(ctx, "admin");
    const { db } = ctx;
    if (!db.children.some((c) => c.id === ctx.params.id)) throw new HttpError(404, "That child record doesn't exist.");
    db.children = db.children.filter((c) => c.id !== ctx.params.id);
    db.results = db.results.filter((r) => r.child_id !== ctx.params.id);
    db.disbursements = db.disbursements.filter((d) => d.child_id !== ctx.params.id);
    saveDb(db);
    return ok(null);
  }],

  ["POST", "/admin/children/:id/disbursements", (ctx) => {
    requireRole(ctx, "admin");
    const { db, body } = ctx;
    if (!db.children.some((c) => c.id === ctx.params.id)) throw new HttpError(404, "That child record doesn't exist.");
    const amount = num(body.amount);
    if (!Number.isFinite(amount) || amount <= 0) return fail("Enter the amount spent.");
    if (!str(body.spent_on)) return fail("Enter the date the money was spent.");
    const row: DisbursementRec = {
      id: uid("dsb"),
      child_id: ctx.params.id!,
      category: (str(body.category) || "other") as DisbursementRec["category"],
      amount,
      spent_on: str(body.spent_on),
      note: str(body.note) || null,
      created_at: new Date().toISOString(),
    };
    db.disbursements.push(row);
    saveDb(db);
    return ok(row);
  }],

  ["DELETE", "/admin/disbursements/:id", (ctx) => {
    requireRole(ctx, "admin");
    ctx.db.disbursements = ctx.db.disbursements.filter((d) => d.id !== ctx.params.id);
    saveDb(ctx.db);
    return ok(null);
  }],

  ["GET", "/admin/schools", (ctx) => {
    requireRole(ctx, "admin");
    const search = (ctx.query.get("search") ?? "").toLowerCase();
    return ok(
      ctx.db.schools
        .filter((s) => !search || `${s.name} ${s.state} ${s.lga}`.toLowerCase().includes(search))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((s) => schoolOut(ctx.db, s)),
    );
  }],

  ["POST", "/admin/schools", (ctx) => {
    requireRole(ctx, "admin");
    const error = validateSchool(ctx.body);
    if (error) return fail(error);
    if (ctx.db.schools.some((s) => s.name.toLowerCase() === str(ctx.body.name).toLowerCase())) {
      return fail("A school with this name is already registered.");
    }
    const school = schoolFromBody(ctx.body);
    ctx.db.schools.push(school);
    saveDb(ctx.db);
    return ok(schoolOut(ctx.db, school));
  }],

  ["PUT", "/admin/schools/:id", (ctx) => {
    requireRole(ctx, "admin");
    const index = ctx.db.schools.findIndex((s) => s.id === ctx.params.id);
    if (index < 0) throw new HttpError(404, "That school doesn't exist.");
    const error = validateSchool({ ...ctx.body, confirm_secondary: true });
    if (error) return fail(error);
    ctx.db.schools[index] = schoolFromBody(ctx.body, ctx.db.schools[index]);
    // Keep each child's state in step with their school.
    ctx.db.children.forEach((c) => {
      if (c.school_id === ctx.params.id) c.state = ctx.db.schools[index]!.state;
    });
    saveDb(ctx.db);
    return ok(schoolOut(ctx.db, ctx.db.schools[index]!));
  }],

  ["DELETE", "/admin/schools/:id", (ctx) => {
    requireRole(ctx, "admin");
    const count = ctx.db.children.filter((c) => c.school_id === ctx.params.id).length;
    if (count) return fail(`${count} child${count === 1 ? " is" : "ren are"} enrolled here. Move them to another school first.`);
    ctx.db.schools = ctx.db.schools.filter((s) => s.id !== ctx.params.id);
    saveDb(ctx.db);
    return ok(null);
  }],

  ["GET", "/admin/results", (ctx) => {
    requireRole(ctx, "admin");
    const { db, query } = ctx;
    const rows = db.results
      .filter((r) => !query.get("child_id") || r.child_id === query.get("child_id"))
      .filter((r) => !query.get("session") || r.session === query.get("session"))
      .filter((r) => !query.get("term") || r.term === query.get("term"))
      .sort((a, b) => b.uploaded_at.localeCompare(a.uploaded_at) || termSortKey(b.session, b.term) - termSortKey(a.session, a.term))
      .map((r) => resultOut(db, r));
    const { page, meta } = paginate(rows, query);
    return ok(page, meta);
  }],

  ["POST", "/admin/results", (ctx) => {
    const admin = requireRole(ctx, "admin");
    const { db, body } = ctx;
    const child = db.children.find((c) => c.id === body.child_id);
    if (!child) return fail("Choose the child these results belong to.");
    if (!/^\d{4}\/\d{4}$/.test(str(body.session))) return fail("Choose an academic session.");
    if (!["first", "second", "third"].includes(str(body.term))) return fail("Choose a term.");
    const subjects = Array.isArray(body.subjects) ? (body.subjects as Body[]) : [];
    const clean = subjects
      .filter((s) => str(s.subject))
      .map((s) => ({ subject: str(s.subject), ca_score: num(s.ca_score), exam_score: num(s.exam_score) }));
    if (!clean.length) return fail("Add at least one subject score.");
    const bad = clean.find((s) => !(s.ca_score >= 0 && s.ca_score <= 40) || !(s.exam_score >= 0 && s.exam_score <= 60));
    if (bad) return fail(`${bad.subject}: CA must be 0–40 and exam 0–60.`);
    const attachment = body.attachment as ResultRec["attachment"];
    const row: ResultRec = {
      id: uid("res"),
      child_id: child.id,
      session: str(body.session),
      term: str(body.term) as ResultRec["term"],
      class_level: (str(body.class_level) || child.class_level) as ResultRec["class_level"],
      subjects: clean,
      position: body.position ? num(body.position) : null,
      class_size: body.class_size ? num(body.class_size) : null,
      teacher_remark: str(body.teacher_remark) || null,
      attachment: attachment ?? null,
      uploaded_at: new Date().toISOString(),
      uploaded_by: admin.id,
    };
    // One result per child per term: re-uploading replaces it.
    db.results = db.results.filter((r) => !(r.child_id === row.child_id && r.session === row.session && r.term === row.term));
    db.results.push(row);
    saveDb(db);
    return ok(resultOut(db, row));
  }],

  ["DELETE", "/admin/results/:id", (ctx) => {
    requireRole(ctx, "admin");
    ctx.db.results = ctx.db.results.filter((r) => r.id !== ctx.params.id);
    saveDb(ctx.db);
    return ok(null);
  }],

  ["GET", "/admin/givers", (ctx) => {
    requireRole(ctx, "admin");
    const { db } = ctx;
    return ok<ApiGiverRow[]>(
      db.users
        .filter((u) => u.role === "giver")
        .map((u) => {
          const pledge = db.pledges.find((p) => p.giver_id === u.id);
          return {
            id: u.id,
            full_name: u.full_name,
            email: u.email,
            phone: u.phone,
            monthly_amount: pledge?.monthly_amount ?? null,
            pledge_status: pledge?.status ?? null,
            total_contributed: db.contributions
              .filter((c) => c.giver_id === u.id && c.status === "paid")
              .reduce((a, c) => a + c.amount, 0),
            children_count: db.children.filter((c) => c.sponsor_ids.includes(u.id)).length,
            joined_at: u.created_at,
          };
        })
        .sort((a, b) => b.total_contributed - a.total_contributed),
    );
  }],

  ["GET", "/admin/contributions", (ctx) => {
    requireRole(ctx, "admin");
    const { db, query } = ctx;
    const rows = db.contributions
      .filter((c) => !query.get("giver_id") || c.giver_id === query.get("giver_id"))
      .sort((a, b) => b.paid_at.localeCompare(a.paid_at))
      .map((c) => contributionOut(db, c));
    return ok(rows);
  }],
];

const compiled = routes.map(([method, pattern, handler]) => {
  const keys: string[] = [];
  const regex = new RegExp(
    `^${pattern.replace(/:(\w+)/g, (_, key: string) => {
      keys.push(key);
      return "([^/]+)";
    })}$`,
  );
  return { method, regex, keys, handler };
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function mockRequest<T>(
  method: Method,
  path: string,
  body: unknown,
  authToken: string | null,
): Promise<ApiResponse<T> | undefined> {
  await sleep(method === "GET" ? MOCK_LIST_LATENCY_MS : MOCK_MUTATION_LATENCY_MS);

  const url = new URL(path, "http://mock.local");
  const db = loadDb();
  const route = compiled.find((r) => r.method === method && r.regex.test(url.pathname));
  if (!route) throw mockAxiosError(404, `No mock handler for ${method} ${url.pathname}`);

  const match = url.pathname.match(route.regex)!;
  const params = Object.fromEntries(route.keys.map((k, i) => [k, decodeURIComponent(match[i + 1]!)]));
  const userId = authToken?.startsWith("mock.") ? authToken.slice(5) : null;
  const user = db.users.find((u) => u.id === userId) ?? null;

  try {
    const res = route.handler({
      db,
      user,
      params,
      query: url.searchParams,
      body: (body ?? {}) as Body,
    });
    // Clone so callers can never mutate the store by reference.
    return JSON.parse(JSON.stringify(res)) as ApiResponse<T>;
  } catch (error) {
    if (error instanceof HttpError) throw mockAxiosError(error.statusCode, error.message);
    if (error instanceof Error) return { status: false, data: null as T, message: error.message };
    throw error;
  }
}

/** Shaped like an axios error so `normalizeApiError` treats both transports alike. */
function mockAxiosError(status: number, message: string) {
  return Object.assign(new Error(message), {
    isAxiosError: true,
    response: { status, data: { status: false, message } },
  });
}
