import { z } from "zod";
import type { School } from "@/lib/dto";

export const ADMIN_SCHOOLS_ROUTES = {
  list: "/admin/schools",
  childrenAt: (schoolId: string) => `/admin/children?school=${schoolId}`,
} as const;

export const OWNERSHIP_OPTIONS = [
  { value: "public", label: "Public (government)" },
  { value: "private", label: "Private" },
  { value: "mission", label: "Mission / faith-based" },
] as const;

export const schoolFormSchema = z.object({
  name: z.string().trim().min(3, "Enter the school's full name."),
  state: z.string().min(1, "Choose a state."),
  lga: z.string().trim().min(1, "Enter the LGA."),
  address: z.string().trim().min(3, "Enter the address."),
  ownership: z.enum(["public", "private", "mission"]),
  principalName: z.string().trim().min(2, "Enter the principal's name."),
  phone: z.string().trim().optional(),
  email: z.union([z.string().trim().email("Enter a valid email."), z.literal("")]).optional(),
  confirmSecondary: z.literal(true, { errorMap: () => ({ message: "The programme only supports secondary schools." }) }),
});

export type SchoolFormValues = z.input<typeof schoolFormSchema>;
export type SchoolFormOutput = z.output<typeof schoolFormSchema>;

export const EMPTY_SCHOOL_FORM: SchoolFormValues = {
  name: "",
  state: "",
  lga: "",
  address: "",
  ownership: "public",
  principalName: "",
  phone: "",
  email: "",
  confirmSecondary: false as unknown as true,
};

export const schoolToForm = (s: School): SchoolFormValues => ({
  name: s.name,
  state: s.state,
  lga: s.lga,
  address: s.address,
  ownership: s.ownership,
  principalName: s.principalName,
  phone: s.phone ?? "",
  email: s.email ?? "",
  confirmSecondary: true,
});

export const formToApi = (v: SchoolFormOutput) => ({
  name: v.name,
  state: v.state,
  lga: v.lga,
  address: v.address,
  ownership: v.ownership,
  principal_name: v.principalName,
  phone: v.phone || null,
  email: v.email || null,
  confirm_secondary: v.confirmSecondary,
});
