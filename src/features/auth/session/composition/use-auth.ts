"use client";

import { useRegisterApp, useSignInApp } from "../application/use-auth";
import type { AuthAudience } from "../domain/auth-schemas";
import useAuthDeps from "./use-auth-deps";

export function useSignIn(audience: AuthAudience) {
  return useSignInApp({ deps: useAuthDeps(), audience });
}

export function useRegister() {
  return useRegisterApp({ deps: useAuthDeps() });
}
