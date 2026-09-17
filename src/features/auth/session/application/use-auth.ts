import type { SessionState } from "@/stores/session-store";
import type { AuthAudience, RegisterOutput, SignInValues } from "../domain/auth-schemas";
import type { AuthMutationPort } from "../ports/auth-service.port";

export interface AuthDeps {
  mutationPort: AuthMutationPort;
  /** Persists the session and moves the user on. Injected so this stays router-free. */
  onAuthenticated: (session: SessionState) => void;
}

export function useSignInApp({ deps, audience }: { deps: AuthDeps; audience: AuthAudience }) {
  const mutation = deps.mutationPort.useSignInMutation();
  return {
    submit: (values: SignInValues) => mutation.mutate({ ...values, audience }, { onSuccess: deps.onAuthenticated }),
    isPending: mutation.isPending || mutation.isSuccess,
    error: mutation.error?.message ?? null,
  };
}

export function useRegisterApp({ deps }: { deps: AuthDeps }) {
  const mutation = deps.mutationPort.useRegisterMutation();
  return {
    submit: (values: RegisterOutput) => mutation.mutate(values, { onSuccess: deps.onAuthenticated }),
    isPending: mutation.isPending || mutation.isSuccess,
    error: mutation.error?.message ?? null,
  };
}
