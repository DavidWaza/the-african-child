/**
 * MOCK BACKEND — in-browser fake of the API, persisted to localStorage so an
 * admin's uploads show up for a giver signed in on the same browser.
 *
 * Not a security boundary. Passwords are stored in plain text because there is
 * no server. Replace with the real API (NEXT_PUBLIC_API_MODE=http) before any
 * real child's data goes near this app.
 */
import type {
  ApiChild,
  ApiDisbursement,
  ApiPledge,
  ApiResult,
  ApiRole,
  ApiSchool,
} from "@/lib/api-types";
import { defaultSubjectsFor } from "@/lib/academics";

export interface UserRec {
  id: string;
  role: ApiRole;
  full_name: string;
  email: string;
  phone: string | null;
  password: string;
  created_at: string;
}

export interface ContributionRec {
  id: string;
  giver_id: string;
  amount: number;
  month: string;
  status: string;
  reference: string;
  paid_at: string;
}

export type SchoolRec = Omit<ApiSchool, "children_count">;
export type ChildRec = Omit<ApiChild, "school_name" | "latest_average">;
export type ResultRec = Omit<ApiResult, "child_name">;
export type DisbursementRec = ApiDisbursement;
export type PledgeRec = ApiPledge;

export interface Db {
  version: number;
  users: UserRec[];
  pledges: PledgeRec[];
  contributions: ContributionRec[];
  schools: SchoolRec[];
  children: ChildRec[];
  results: ResultRec[];
  disbursements: DisbursementRec[];
}

const STORAGE_KEY = "tac:mock-db";
const DB_VERSION = 1;

export const DEMO_ACCOUNTS = {
  admin: { email: "admin@theafricanchild.org", password: "admin1234" },
  giver: { email: "ngozi@example.com", password: "giver1234" },
} as const;

let cache: Db | null = null;

export function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function loadDb(): Db {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Db;
      if (parsed.version === DB_VERSION) {
        cache = parsed;
        return parsed;
      }
    }
  } catch {
    // fall through to a fresh seed
  }
  cache = seed();
  saveDb(cache);
  return cache;
}

/** Throws a readable error when the browser's storage quota is exhausted. */
export function saveDb(db: Db) {
  cache = db;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // Drop the in-memory copy so the rejected change doesn't linger.
    cache = null;
    throw new Error("Browser storage is full. Remove large attachments or photos and try again.");
  }
}

export function resetDb() {
  cache = seed();
  saveDb(cache);
}

/* ------------------------------------------------------------------ seed -- */

function monthsBack(n: number): string[] {
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
}

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

function seed(): Db {
  const now = new Date().toISOString();
  const months = monthsBack(9);
  const rand = rng(42);

  const users: UserRec[] = [
    { id: "usr_admin", role: "admin", full_name: "Programme Admin", email: DEMO_ACCOUNTS.admin.email, phone: "+2348001234567", password: DEMO_ACCOUNTS.admin.password, created_at: `${months[0]}-01T09:00:00Z` },
    { id: "usr_ngozi", role: "giver", full_name: "Ngozi Adeyemi", email: DEMO_ACCOUNTS.giver.email, phone: "+2348031112222", password: DEMO_ACCOUNTS.giver.password, created_at: `${months[0]}-03T09:00:00Z` },
    { id: "usr_tunde", role: "giver", full_name: "Tunde Bakare", email: "tunde@example.com", phone: "+2348053334444", password: "giver1234", created_at: `${months[2]}-10T09:00:00Z` },
    { id: "usr_grace", role: "giver", full_name: "Grace Okon", email: "grace@example.com", phone: "+447700900123", password: "giver1234", created_at: `${months[4]}-05T09:00:00Z` },
  ];

  const pledges: PledgeRec[] = [
    { giver_id: "usr_ngozi", monthly_amount: 50000, status: "active", started_at: `${months[0]}-03`, updated_at: now },
    { giver_id: "usr_tunde", monthly_amount: 25000, status: "active", started_at: `${months[2]}-10`, updated_at: now },
    { giver_id: "usr_grace", monthly_amount: 75000, status: "active", started_at: `${months[4]}-05`, updated_at: now },
  ];

  const contributions: ContributionRec[] = [];
  const startIndex: Record<string, number> = { usr_ngozi: 0, usr_tunde: 2, usr_grace: 4 };
  for (const p of pledges) {
    // Leave the current month unpaid so the "pay this month" flow is visible.
    for (let i = startIndex[p.giver_id]!; i < months.length - 1; i++) {
      contributions.push({
        id: uid("ctb"),
        giver_id: p.giver_id,
        amount: p.monthly_amount,
        month: months[i]!,
        status: "paid",
        reference: `TAC-${months[i]!.replace("-", "")}-${p.giver_id.slice(4, 8).toUpperCase()}`,
        paid_at: `${months[i]}-0${1 + (i % 7)}T10:15:00Z`,
      });
    }
  }

  const schools: SchoolRec[] = [
    { id: "sch_kings", name: "Community Secondary School, Ikot Ekpene", state: "Akwa Ibom", lga: "Ikot Ekpene", address: "12 Aba Road, Ikot Ekpene", ownership: "public", principal_name: "Mrs. Eno Udoh", phone: "+2348021230001", email: "info@cssikotekpene.edu.ng", created_at: now },
    { id: "sch_unity", name: "Unity Girls' College, Kano", state: "Kano", lga: "Nassarawa", address: "Zoo Road, Kano", ownership: "public", principal_name: "Hajiya Aisha Bello", phone: "+2348021230002", email: null, created_at: now },
    { id: "sch_hope", name: "Hope Mission Secondary School", state: "Lagos", lga: "Ikorodu", address: "4 Ebute Road, Ikorodu", ownership: "mission", principal_name: "Rev. Samuel Ade", phone: "+2348021230003", email: "hopemission@example.org", created_at: now },
    { id: "sch_rivers", name: "Government Secondary School, Bori", state: "Rivers", lga: "Khana", address: "Bori Town", ownership: "public", principal_name: "Mr. Barine Kpea", phone: "+2348021230004", email: null, created_at: now },
  ];

  const childSeeds: Array<[string, string, "female" | "male", string, ChildRec["class_level"], string, string[], string | null, string, string]> = [
    ["Amina", "Yusuf", "female", "2011-04-12", "JSS3", "sch_unity", ["usr_ngozi", "usr_grace"], "/assets/amina.jpg", "Doctor", "Amina topped her primary class but her family could not afford secondary school fees after her father's farm failed."],
    ["David", "Etim", "male", "2009-09-03", "SSS2", "sch_kings", ["usr_ngozi"], "/assets/student-2.png", "Engineer", "David walks 5km to school each day. He loves physics and builds radios from scrap parts."],
    ["Chidinma", "Okafor", "female", "2010-01-22", "SSS1", "sch_hope", ["usr_tunde"], "/assets/student.jpg", "Lawyer", "After a year out of school helping her mother trade, Chidinma returned and now leads her class debate team."],
    ["Samuel", "Nwibe", "male", "2012-06-30", "JSS1", "sch_rivers", ["usr_ngozi", "usr_tunde"], "/assets/student-3.png", "Pilot", "Samuel is the first in his family to attend secondary school."],
    ["Fatima", "Sani", "female", "2011-11-08", "JSS2", "sch_unity", ["usr_grace"], null, "Teacher", "Fatima tutors younger children in her compound every weekend."],
    ["Emmanuel", "Akpan", "male", "2008-02-17", "SSS3", "sch_kings", ["usr_grace"], null, "Accountant", "Emmanuel sits his WASSCE this year and hopes to study accounting."],
    ["Blessing", "Ade", "female", "2010-07-25", "SSS1", "sch_hope", [], null, "Nurse", "Blessing was referred by her church after her guardian lost his job."],
  ];

  const guardians = [
    ["Musa Yusuf", "Father"], ["Grace Etim", "Mother"], ["Ifeoma Okafor", "Mother"], ["Nkechi Nwibe", "Aunt"],
    ["Zainab Sani", "Mother"], ["Imaobong Akpan", "Grandmother"], ["Pastor John Ade", "Guardian"],
  ];

  const children: ChildRec[] = childSeeds.map(([first, last, gender, dob, level, schoolId, sponsors, photo, aspiration, story], i) => {
    const school = schools.find((s) => s.id === schoolId)!;
    const phone = `+23480${String(55500000 + i * 1111).padStart(8, "0")}`;
    return {
      id: `chd_${first.toLowerCase()}`,
      first_name: first,
      last_name: last,
      gender,
      date_of_birth: dob,
      photo_url: photo,
      school_id: schoolId,
      class_level: level,
      state: school.state,
      story,
      aspiration,
      status: sponsors.length ? "active" : "pending_review",
      guardian: {
        full_name: guardians[i]![0]!,
        relationship: guardians[i]![1]!,
        phone,
        whatsapp: phone,
        email: null,
        address: `${school.lga}, ${school.state}`,
      },
      sponsor_ids: sponsors,
      enrolled_at: `${months[0]}-15`,
      created_at: now,
    };
  });

  const sessionStart = new Date().getMonth() >= 8 ? new Date().getFullYear() : new Date().getFullYear() - 1;
  const lastSession = `${sessionStart - 1}/${sessionStart}`;
  const results: ResultRec[] = [];
  for (const child of children.slice(0, 6)) {
    const base = 48 + rand() * 25;
    (["first", "second", "third"] as const).forEach((term, t) => {
      const trend = t * (2 + rand() * 3);
      results.push({
        id: uid("res"),
        child_id: child.id,
        session: lastSession,
        term,
        class_level: child.class_level,
        subjects: defaultSubjectsFor(child.class_level).map((subject) => {
          const target = Math.min(96, Math.max(30, base + trend + (rand() - 0.5) * 22));
          const ca = Math.round(Math.min(40, target * 0.4));
          const exam = Math.round(Math.min(60, target * 0.6));
          return { subject, ca_score: ca, exam_score: exam };
        }),
        position: 1 + Math.floor(rand() * 15),
        class_size: 40 + Math.floor(rand() * 20),
        teacher_remark: t === 2 ? "Steady improvement. Keep it up." : "A focused and respectful student.",
        attachment: null,
        uploaded_at: now,
        uploaded_by: "usr_admin",
      });
    });
  }

  const disbursements: DisbursementRec[] = [];
  const plan: [DisbursementRec["category"], number][] = [
    ["tuition", 45000], ["uniform", 18000], ["books", 22000], ["feeding", 15000], ["transport", 8000],
  ];
  for (const child of children.filter((c) => c.sponsor_ids.length)) {
    plan.forEach(([category, amount], i) => {
      disbursements.push({
        id: uid("dsb"),
        child_id: child.id,
        category,
        amount: amount + Math.round(rand() * 5) * 1000,
        spent_on: `${months[1 + i]}-12`,
        note: category === "tuition" ? "Paid directly to the school bursar." : null,
        created_at: now,
      });
    });
  }
  const senior = children.find((c) => c.class_level === "SSS3");
  if (senior) {
    disbursements.push({ id: uid("dsb"), child_id: senior.id, category: "exam_fees", amount: 27500, spent_on: `${months[6]}-20`, note: "WASSCE registration", created_at: now });
  }

  return { version: DB_VERSION, users, pledges, contributions, schools, children, results, disbursements };
}
