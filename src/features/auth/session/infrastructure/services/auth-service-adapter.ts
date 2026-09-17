import type { ApiSession } from "@/lib/api-types";
import { api } from "@/lib/http/transport";
import type { AuthServicePort } from "../../ports/auth-service.port";

export default function useAuthServiceAdapter(): AuthServicePort {
  return {
    signIn: ({ email, password, audience }) => api.post<ApiSession>("/auth/login", { email, password, audience }),
    register: (v) =>
      api.post<ApiSession>("/auth/register", {
        full_name: v.fullName,
        email: v.email,
        phone: v.phone || null,
        password: v.password,
        monthly_amount: v.monthlyAmount,
      }),
  };
}
