"use client";

/**
 * Public-site forms. There is no backend for these yet: submissions are
 * validated, simulated, and acknowledged. Wire each `send` to an API route or
 * email service before launch.
 */
import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import {
  NAlert,
  NButton,
  NField,
  NFieldHint,
  NFieldLabel,
  NIcon,
  NInput,
  NInputAddon,
  NInputGroup,
  NSelect,
  NTextarea,
} from "@/components/n";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import { INVOLVEMENT } from "./site-content";

const send = () => new Promise((r) => setTimeout(r, 900));

/* ---------------------------------------------------------------- donate -- */

const DONATION_PRESETS = [
  { amount: 5000, text: "Notebooks & pens for a term" },
  { amount: 15000, text: "A school uniform and sandals" },
  { amount: 30000, text: "A full set of textbooks" },
  { amount: 60000, text: "A term's tuition and levies" },
];

const donateSchema = z.object({
  amount: z.coerce.number({ invalid_type_error: "Enter an amount." }).min(1000, "The minimum donation is ₦1,000."),
  fullName: z.string().trim().min(2, "Tell us your name."),
  email: z.string().trim().email("Enter a valid email so we can send your receipt."),
  message: z.string().trim().max(300).optional(),
});

type DonateIn = z.input<typeof donateSchema>;
type DonateOut = z.output<typeof donateSchema>;

export function DonateForm() {
  const [done, setDone] = React.useState<DonateOut | null>(null);
  const form = useForm<DonateIn, unknown, DonateOut>({
    resolver: zodResolver(donateSchema),
    defaultValues: { amount: 15000, fullName: "", email: "", message: "" },
  });
  const amount = Number(form.watch("amount")) || 0;
  const { errors, isSubmitting } = form.formState;

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-green-50 text-green-500">
          <NIcon name="complete" weight="fill" className="size-9" />
        </span>
        <h3 className="text-3xl font-semibold">Thank you, {done.fullName.split(" ")[0]}!</h3>
        <p className="max-w-sm text-base-550">
          Your {formatMoney(done.amount)} gift has been recorded. A receipt is on its way to {done.email}.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <NButton asChild>
            <Link href="/auth/register">Make it monthly</Link>
          </NButton>
          <NButton color="secondary" variant="outline" onClick={() => setDone(null)}>
            Give again
          </NButton>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(async (v) => {
        await send();
        setDone(v);
      })}
    >
      <NField error={errors.amount?.message}>
        <NFieldLabel>Choose an amount</NFieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {DONATION_PRESETS.map((p) => (
            <button
              key={p.amount}
              type="button"
              onClick={() => form.setValue("amount", p.amount, { shouldValidate: true })}
              className={cn(
                "flex cursor-pointer flex-col items-start gap-0.5 rounded-2xl border p-3.5 text-left transition-colors",
                amount === p.amount ? "border-accent-500 bg-accent-500 text-base-0" : "border-base-150 bg-base-0 hover:border-accent-150",
              )}
            >
              <span className="font-display text-xl font-semibold tabular-nums">{formatMoney(p.amount)}</span>
              <span className={cn("text-xs", amount === p.amount ? "text-base-0/80" : "text-base-500")}>{p.text}</span>
            </button>
          ))}
        </div>
        <NInputGroup className="mt-1">
          <NInputAddon>₦</NInputAddon>
          <NInput type="number" inputMode="numeric" min={1000} step={500} aria-label="Custom amount" {...form.register("amount")} />
        </NInputGroup>
      </NField>

      <div className="grid gap-4 sm:grid-cols-2">
        <NField error={errors.fullName?.message}>
          <NFieldLabel>Full name</NFieldLabel>
          <NInput autoComplete="name" {...form.register("fullName")} />
        </NField>
        <NField error={errors.email?.message}>
          <NFieldLabel>Email</NFieldLabel>
          <NInput type="email" autoComplete="email" {...form.register("email")} />
        </NField>
      </div>

      <NField>
        <NFieldLabel optional>A note for the children</NFieldLabel>
        <NTextarea rows={3} {...form.register("message")} />
      </NField>

      <NAlert tone="info">
        <p>
          <strong className="text-accent-600">Demo checkout.</strong> No card is charged yet — connect a payment provider before launch.
        </p>
      </NAlert>

      <NButton type="submit" size="lg" color="gold" loading={isSubmitting}>
        <NIcon name="family" weight="fill" /> Donate {amount >= 1000 ? formatMoney(amount) : ""}
      </NButton>
    </form>
  );
}

/* --------------------------------------------------------------- contact -- */

const contactSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name."),
  email: z.string().trim().email("Enter a valid email address."),
  topic: z.string().min(1),
  subject: z.string().trim().min(3, "Add a short subject."),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters)."),
  // Honeypot: real people never see or fill this.
  website: z.string().max(0).optional(),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const params = useSearchParams();
  const initialTopic = params.get("topic") ?? "general";
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", topic: initialTopic, subject: "", message: "", website: "" },
  });
  const { errors, isSubmitting } = form.formState;

  return (
    <form
      noValidate
      className="grid gap-5 sm:grid-cols-2"
      onSubmit={form.handleSubmit(async (v) => {
        if (v.website) return;
        await send();
        toast.success("Message sent", { description: "Thank you for reaching out. We'll reply within two working days." });
        form.reset({ name: "", email: "", topic: v.topic, subject: "", message: "", website: "" });
      })}
    >
      <NField error={errors.name?.message}>
        <NFieldLabel>Your name</NFieldLabel>
        <NInput autoComplete="name" {...form.register("name")} />
      </NField>
      <NField error={errors.email?.message}>
        <NFieldLabel>Email</NFieldLabel>
        <NInput type="email" autoComplete="email" {...form.register("email")} />
      </NField>
      <NField>
        <NFieldLabel>I&apos;m getting in touch about</NFieldLabel>
        <NSelect {...form.register("topic")}>
          <option value="general">A general question</option>
          <option value="giving">My giving or pledge</option>
          {INVOLVEMENT.map((i) => (
            <option key={i.topic} value={i.topic}>
              {i.title}
            </option>
          ))}
          <option value="referral">Referring a child</option>
        </NSelect>
      </NField>
      <NField error={errors.subject?.message}>
        <NFieldLabel>Subject</NFieldLabel>
        <NInput {...form.register("subject")} />
      </NField>
      <NField error={errors.message?.message} className="sm:col-span-2">
        <NFieldLabel>Message</NFieldLabel>
        <NTextarea rows={6} {...form.register("message")} />
        <NFieldHint>Please don&apos;t include a child&apos;s full name or address in this form.</NFieldHint>
      </NField>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...form.register("website")} />
      <div className="sm:col-span-2">
        <NButton type="submit" size="lg" loading={isSubmitting} className="w-full sm:w-auto">
          Send message <NIcon name="forward" />
        </NButton>
      </div>
    </form>
  );
}
