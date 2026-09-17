import { z } from "zod";
import type { ApiChild } from "@/lib/api-types";
import type { Child } from "@/lib/dto";

export const ADMIN_CHILDREN_ROUTES = {
  list: "/admin/children",
  create: "/admin/children/new",
  detail: (id: string) => `/admin/children/${id}`,
  edit: (id: string) => `/admin/children/${id}/edit`,
  uploadResult: (id: string) => `/admin/results?upload=1&child=${id}`,
  schools: "/admin/schools",
} as const;

export const CHILD_STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "pending_review", label: "Awaiting match" },
  { value: "graduated", label: "Graduated" },
  { value: "withdrawn", label: "Withdrawn" },
] as const;

export type ChildStatusFilter = (typeof CHILD_STATUS_FILTERS)[number]["value"];

const phone = z
  .string()
  .trim()
  .regex(/^\+?[\d\s()-]{7,20}$/, "Enter a valid phone number.");

export const childFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  gender: z.enum(["female", "male"]),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required.")
    .refine((v) => {
      const age = (Date.now() - new Date(v).getTime()) / (365.25 * 24 * 3600 * 1000);
      return age >= 8 && age <= 22;
    }, "Secondary school students are usually 9–21 years old. Check the date."),
  photoUrl: z.string().nullable(),
  schoolId: z.string().min(1, "Choose a school."),
  classLevel: z.enum(["JSS1", "JSS2", "JSS3", "SSS1", "SSS2", "SSS3"], { errorMap: () => ({ message: "Choose a class." }) }),
  status: z.enum(["active", "pending_review", "graduated", "withdrawn"]),
  aspiration: z.string().trim().optional(),
  story: z.string().trim().max(800, "Keep the story under 800 characters."),
  guardian: z.object({
    fullName: z.string().trim().min(2, "Guardian's name is required."),
    relationship: z.string().trim().min(1, "Relationship is required."),
    phone,
    whatsapp: z.union([phone, z.literal("")]).optional(),
    email: z.union([z.string().trim().email("Enter a valid email."), z.literal("")]).optional(),
    address: z.string().trim().optional(),
  }),
  sponsorIds: z.array(z.string()),
});

export type ChildFormValues = z.infer<typeof childFormSchema>;

export const EMPTY_CHILD_FORM: ChildFormValues = {
  firstName: "",
  lastName: "",
  gender: "female",
  dateOfBirth: "",
  photoUrl: null,
  schoolId: "",
  classLevel: "JSS1",
  status: "pending_review",
  aspiration: "",
  story: "",
  guardian: { fullName: "", relationship: "Mother", phone: "", whatsapp: "", email: "", address: "" },
  sponsorIds: [],
};

export const GUARDIAN_RELATIONSHIPS = ["Mother", "Father", "Grandmother", "Grandfather", "Aunt", "Uncle", "Sibling", "Guardian"];

export function childToForm(c: Child): ChildFormValues {
  return {
    firstName: c.firstName,
    lastName: c.lastName,
    gender: c.gender,
    dateOfBirth: c.dateOfBirth,
    photoUrl: c.photoUrl,
    schoolId: c.schoolId,
    classLevel: c.classLevel,
    status: c.status as ChildFormValues["status"],
    aspiration: c.aspiration ?? "",
    story: c.story,
    guardian: {
      fullName: c.guardian.fullName,
      relationship: c.guardian.relationship,
      phone: c.guardian.phone,
      whatsapp: c.guardian.whatsapp ?? "",
      email: c.guardian.email ?? "",
      address: c.guardian.address ?? "",
    },
    sponsorIds: c.sponsorIds,
  };
}

/** form → wire body */
export function formToApi(v: ChildFormValues): Partial<ApiChild> {
  return {
    first_name: v.firstName,
    last_name: v.lastName,
    gender: v.gender,
    date_of_birth: v.dateOfBirth,
    photo_url: v.photoUrl,
    school_id: v.schoolId,
    class_level: v.classLevel,
    status: v.status,
    aspiration: v.aspiration || null,
    story: v.story,
    guardian: {
      full_name: v.guardian.fullName,
      relationship: v.guardian.relationship,
      phone: v.guardian.phone,
      whatsapp: v.guardian.whatsapp || null,
      email: v.guardian.email || null,
      address: v.guardian.address || null,
    },
    sponsor_ids: v.sponsorIds,
  };
}

export const disbursementSchema = z.object({
  category: z.enum(["tuition", "uniform", "books", "feeding", "transport", "exam_fees", "other"]),
  amount: z.coerce.number({ invalid_type_error: "Enter an amount." }).positive("Enter the amount spent."),
  spentOn: z.string().min(1, "Enter the date."),
  note: z.string().trim().max(160).optional(),
});

export type DisbursementFormValues = z.input<typeof disbursementSchema>;
export type DisbursementFormOutput = z.output<typeof disbursementSchema>;

export interface GiverOption {
  id: string;
  fullName: string;
  email: string;
  childrenCount: number;
}

export interface SchoolOption {
  id: string;
  name: string;
  state: string;
}
