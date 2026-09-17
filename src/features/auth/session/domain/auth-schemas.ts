import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export type SignInValues = z.infer<typeof signInSchema>;

export const PLEDGE_PRESETS = [10000, 25000, 50000, 100000] as const;

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Tell us your full name."),
    email: z.string().trim().email("Enter a valid email address."),
    phone: z.string().trim().optional(),
    monthlyAmount: z.coerce.number({ invalid_type_error: "Enter an amount." }).min(1000, "The minimum monthly pledge is ₦1,000."),
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string(),
    consent: z.literal(true, { errorMap: () => ({ message: "Please accept the safeguarding commitment." }) }),
  })
  .refine((v) => v.password === v.confirmPassword, { path: ["confirmPassword"], message: "Passwords don't match." });

export type RegisterValues = z.input<typeof registerSchema>;
export type RegisterOutput = z.output<typeof registerSchema>;

export type AuthAudience = "giver" | "admin";
