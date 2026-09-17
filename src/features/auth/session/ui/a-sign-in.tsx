"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NAlert, NButton, NField, NFieldLabel, NInput } from "@/components/n";
import { DEMO_ACCOUNTS } from "@/mock-backend";
import { signInSchema, type AuthAudience, type SignInValues } from "../domain/auth-schemas";
import { useSignIn } from "../composition/use-auth";

const IS_MOCK = process.env.NEXT_PUBLIC_API_MODE !== "http";

export function ASignIn({ audience }: { audience: AuthAudience }) {
  const { submit, isPending, error } = useSignIn(audience);
  const form = useForm<SignInValues>({ resolver: zodResolver(signInSchema), defaultValues: { email: "", password: "" } });
  const errors = form.formState.errors;
  const demo = DEMO_ACCOUNTS[audience];

  return (
    <form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-5" noValidate>
      {error && (
        <NAlert tone="danger">
          <span className="font-medium">{error}</span>
        </NAlert>
      )}

      <NField error={errors.email?.message}>
        <NFieldLabel>Email address</NFieldLabel>
        <NInput type="email" autoComplete="email" placeholder="you@example.com" {...form.register("email")} />
      </NField>

      <NField error={errors.password?.message}>
        <NFieldLabel>Password</NFieldLabel>
        <NInput type="password" autoComplete="current-password" placeholder="••••••••" {...form.register("password")} />
      </NField>

      <NButton type="submit" size="lg" loading={isPending} className="mt-1 w-full">
        Sign in
      </NButton>

      {audience === "giver" ? (
        <p className="text-center text-sm text-base-500">
          New to The African Child?{" "}
          <Link href="/auth/register" className="font-semibold text-accent-600 hover:underline">
            Become a giver
          </Link>
        </p>
      ) : (
        <p className="text-center text-sm text-base-500">
          Are you a giver?{" "}
          <Link href="/auth/login" className="font-semibold text-accent-600 hover:underline">
            Sign in here
          </Link>
        </p>
      )}

      {IS_MOCK && (
        <div className="rounded-xl border border-dashed border-base-150 bg-base-0 p-4 text-sm">
          <p className="font-medium text-base-900">Demo mode — no backend connected</p>
          <p className="mt-1 text-base-500">
            Data is stored in this browser only.{" "}
            <button
              type="button"
              className="cursor-pointer font-semibold text-accent-600 hover:underline"
              onClick={() => form.reset({ email: demo.email, password: demo.password })}
            >
              Fill the demo {audience} account
            </button>
          </p>
        </div>
      )}
    </form>
  );
}
