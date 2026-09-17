import type { ApiChild, ApiChildDetail } from "@/lib/api-types";
import { api } from "@/lib/http/transport";
import type { GiverChildrenServicePort } from "../../ports/giver-children.port";

export default function useGiverChildrenServiceAdapter(): GiverChildrenServicePort {
  return {
    list: () => api.get<ApiChild[]>("/giver/children"),
    detail: (id) => api.get<ApiChildDetail>(`/giver/children/${encodeURIComponent(id)}`),
  };
}
