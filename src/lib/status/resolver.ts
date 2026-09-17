import { STATUS_REGISTRY, UNKNOWN_STATUS, type StatusDefinition } from "./registry";
import type { StatusKind } from "./types";

/**
 * Raw backend spelling → canonical status. When the backend invents a new
 * spelling, add one line here and every screen updates.
 */
const GLOBAL_STATUS_ALIASES: Record<string, string> = {
  enrolled: "active",
  sponsored: "active",
  pending: "pending_review",
  awaiting_review: "pending_review",
  completed: "graduated",
  dropped_out: "withdrawn",
  success: "paid",
  successful: "paid",
  settled: "paid",
  initiated: "processing",
  in_progress: "processing",
  declined: "failed",
  reversed: "failed",
  on_hold: "paused",
  stopped: "cancelled",
};

const KIND_ALIASES: Partial<Record<StatusKind, Record<string, string>>> = {
  pledge: { pending: "paused" },
  contribution: { pending: "processing" },
};

function normalise(raw: string) {
  return raw.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function resolveStatus(kind: StatusKind, raw: string | null | undefined): StatusDefinition {
  if (!raw) return UNKNOWN_STATUS;
  const key = normalise(raw);
  const table = STATUS_REGISTRY[kind] as Record<string, StatusDefinition>;
  const canonical = table[key] ? key : (KIND_ALIASES[kind]?.[key] ?? GLOBAL_STATUS_ALIASES[key] ?? key);
  return table[canonical] ?? UNKNOWN_STATUS;
}
