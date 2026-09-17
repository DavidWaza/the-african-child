import type { UseMutationResult } from "@tanstack/react-query";
import type { ApiSession } from "@/lib/api-types";
import type { ApiResponse } from "@/lib/http/envelope";
import type { SessionState } from "@/stores/session-store";
import type { AuthAudience, RegisterOutput, SignInValues } from "../domain/auth-schemas";

export interface AuthServicePort {
  signIn(input: SignInValues & { audience: AuthAudience }): Promise<ApiResponse<ApiSession> | undefined>;
  register(input: RegisterOutput): Promise<ApiResponse<ApiSession> | undefined>;
}

export interface AuthMutationPort {
  useSignInMutation(): UseMutationResult<SessionState, Error, SignInValues & { audience: AuthAudience }>;
  useRegisterMutation(): UseMutationResult<SessionState, Error, RegisterOutput>;
}
