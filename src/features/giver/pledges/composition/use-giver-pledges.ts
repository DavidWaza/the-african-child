"use client";

import { toast } from "sonner";
import { toastError } from "@/lib/http/errors";
import useGiverPledgesQueryAdapter from "../adapters/giver-pledges-query-adapter";
import { useGiverPledgesApp, type GiverPledgesDeps } from "../application/use-giver-pledges";
import useGiverPledgesServiceAdapter from "../infrastructure/services/giver-pledges-service-adapter";

export function useGiverPledgesDeps(): GiverPledgesDeps {
  return {
    queryPort: useGiverPledgesQueryAdapter(useGiverPledgesServiceAdapter()),
    notify: { success: (m) => toast.success(m), error: toastError },
  };
}

export function useGiverPledges() {
  return useGiverPledgesApp({ deps: useGiverPledgesDeps() });
}
