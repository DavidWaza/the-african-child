import { useMutation } from "@tanstack/react-query";
import type { ApiSession } from "@/lib/api-types";
import { unwrapApiResponse } from "@/lib/http/envelope";
import { toSessionUser } from "@/lib/transformers";
import type { SessionState } from "@/stores/session-store";
import type { AuthMutationPort, AuthServicePort } from "../ports/auth-service.port";

const toState = (s: ApiSession): SessionState => ({ token: s.token, user: toSessionUser(s.user) });

export default function useAuthMutationAdapter(deps: AuthServicePort): AuthMutationPort {
  return {
    useSignInMutation: () =>
      useMutation({
        mutationFn: async (input) => toState(unwrapApiResponse(await deps.signIn(input), "We couldn't sign you in.").data),
      }),
    useRegisterMutation: () =>
      useMutation({
        mutationFn: async (input) => toState(unwrapApiResponse(await deps.register(input), "We couldn't create your account.").data),
      }),
  };
}
