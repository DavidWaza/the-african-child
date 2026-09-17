import { z } from "zod";
import type { ApiAttachment } from "@/lib/api-types";
import { academicSessions, CA_MAX, defaultSubjectsFor, EXAM_MAX } from "@/lib/academics";

export const ADMIN_RESULTS_ROUTES = {
  list: "/admin/results",
  child: (id: string) => `/admin/children/${id}`,
} as const;

const score = (max: number, label: string) =>
  z.coerce
    .number({ invalid_type_error: `Enter the ${label} score.` })
    .min(0, `${label} can't be negative.`)
    .max(max, `${label} is out of ${max}.`);

export const resultFormSchema = z.object({
  childId: z.string().min(1, "Choose a child."),
  session: z.string().regex(/^\d{4}\/\d{4}$/, "Choose a session."),
  term: z.enum(["first", "second", "third"]),
  classLevel: z.enum(["JSS1", "JSS2", "JSS3", "SSS1", "SSS2", "SSS3"]),
  subjects: z
    .array(
      z.object({
        subject: z.string().trim().min(1, "Name the subject."),
        ca: score(CA_MAX, "CA"),
        exam: score(EXAM_MAX, "Exam"),
      }),
    )
    .min(1, "Add at least one subject."),
  position: z.union([z.coerce.number().int().positive(), z.literal("")]).optional(),
  classSize: z.union([z.coerce.number().int().positive(), z.literal("")]).optional(),
  teacherRemark: z.string().trim().max(300).optional(),
});

export type ResultFormValues = z.input<typeof resultFormSchema>;
export type ResultFormOutput = z.output<typeof resultFormSchema>;

export function emptyResultForm(childId = "", classLevel: ResultFormOutput["classLevel"] = "JSS1"): ResultFormValues {
  return {
    childId,
    session: academicSessions(1)[0]!,
    term: "first",
    classLevel,
    subjects: defaultSubjectsFor(classLevel).map((subject) => ({ subject, ca: "" as unknown as number, exam: "" as unknown as number })),
    position: "",
    classSize: "",
    teacherRemark: "",
  };
}

export function formToApi(v: ResultFormOutput, attachment: ApiAttachment | null) {
  return {
    child_id: v.childId,
    session: v.session,
    term: v.term,
    class_level: v.classLevel,
    subjects: v.subjects.map((s) => ({ subject: s.subject, ca_score: s.ca, exam_score: s.exam })),
    position: v.position === "" ? null : (v.position ?? null),
    class_size: v.classSize === "" ? null : (v.classSize ?? null),
    teacher_remark: v.teacherRemark || null,
    attachment,
  };
}

/**
 * Parses pasted rows — "Mathematics, 32, 51" or tab-separated from a
 * spreadsheet — into subject scores. Lines that don't parse are skipped.
 */
export function parsePastedScores(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.split(/\t|,|;/).map((c) => c.trim()))
    .filter((cells) => cells.length >= 3 && cells[0] && !Number.isNaN(Number(cells[1])) && !Number.isNaN(Number(cells[2])))
    .map(([subject, ca, exam]) => ({ subject: subject!, ca: Number(ca), exam: Number(exam) }));
}

export interface ChildOption {
  id: string;
  fullName: string;
  classLevel: ResultFormOutput["classLevel"];
  schoolName: string;
}
