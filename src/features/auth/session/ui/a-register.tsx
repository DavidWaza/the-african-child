"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NAlert, NButton, NCheckbox, NField, NFieldHint, NFieldLabel, NInput, NInputAddon, NInputGroup } from "@/components/n";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PLEDGE_PRESETS, registerSchema, type RegisterOutput, type RegisterValues } from "../domain/auth-schemas";
import { useRegister } from "../composition/use-auth";

export function ARegister() {
  const { submit, isPending, error } = useRegister();
  const form = useForm<RegisterValues, unknown, RegisterOutput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", phone: "", monthlyAmount: 25000, password: "", confirmPassword: "" },
  });
  const errors = form.formState.errors;
  const amount = Number(form.watch("monthlyAmount"));

  return (
    <form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-5" noValidate>
      {error && (
        <NAlert tone="danger">
          <span className="font-medium">{error}</span>
        </NAlert>
      )}

      <NField error={errors.fullName?.message}>
        <NFieldLabel>Full name</NFieldLabel>
        <NInput autoComplete="name" placeholder="Ngozi Adeyemi" {...form.register("fullName")} />
      </NField>

      <div className="grid gap-5 sm:grid-cols-2">
        <NField error={errors.email?.message}>
          <NFieldLabel>Email</NFieldLabel>
          <NInput type="email" autoComplete="email" placeholder="you@example.com" {...form.register("email")} />
        </NField>
        <NField>
          <NFieldLabel optional>Phone</NFieldLabel>
          <NInput type="tel" autoComplete="tel" placeholder="+234…" {...form.register("phone")} />
        </NField>
      </div>

      <NField error={errors.monthlyAmount?.message}>
        <NFieldLabel>Monthly pledge</NFieldLabel>
        <div className="grid grid-cols-4 gap-2">
          {PLEDGE_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => form.setValue("monthlyAmount", p, { shouldValidate: true })}
              className={cn(
                "h-10 cursor-pointer rounded-xl border text-sm font-semibold tabular-nums transition-colors",
                amount === p ? "border-accent-500 bg-accent-500 text-base-0" : "border-base-150 bg-base-0 hover:border-accent-150",
              )}
            >
              {formatMoney(p, { compact: true })}
            </button>
          ))}
        </div>
        <NInputGroup>
          <NInputAddon>₦</NInputAddon>
          <NInput type="number" inputMode="numeric" min={1000} step={500} {...form.register("monthlyAmount")} />
        </NInputGroup>
        <NFieldHint>You can change or pause this any time from your dashboard.</NFieldHint>
      </NField>

      <div className="grid gap-5 sm:grid-cols-2">
        <NField error={errors.password?.message}>
          <NFieldLabel>Password</NFieldLabel>
          <NInput type="password" autoComplete="new-password" {...form.register("password")} />
        </NField>
        <NField error={errors.confirmPassword?.message}>
          <NFieldLabel>Confirm password</NFieldLabel>
          <NInput type="password" autoComplete="new-password" {...form.register("confirmPassword")} />
        </NField>
      </div>

      <NField error={errors.consent?.message}>
        <NCheckbox
          {...form.register("consent")}
          label="I will contact families respectfully, never ask for personal favours, and report any concern to the programme team."
        />
      </NField>

      <NButton type="submit" size="lg" loading={isPending} className="w-full">
        Create account{amount >= 1000 ? ` · ${formatMoney(amount)}/month` : ""}
      </NButton>

      <p className="text-center text-sm text-base-500">
        Already a giver?{" "}
        <Link href="/auth/login" className="font-semibold text-accent-600 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
