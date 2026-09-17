/** Canonical statuses, grouped by kind. Backends may spell them differently — see resolver.ts. */
export const STATUS_KINDS = {
  child: ["active", "pending_review", "graduated", "withdrawn"],
  contribution: ["paid", "processing", "failed"],
  pledge: ["active", "paused", "cancelled"],
  performance: ["excellent", "good", "average", "needs_support"],
} as const;

export type StatusKind = keyof typeof STATUS_KINDS;
export type CanonicalStatus<K extends StatusKind = StatusKind> = (typeof STATUS_KINDS)[K][number];

/** Tones are semantic, not colours. palette.ts decides what each looks like. */
export type StatusTone = "neutral" | "info" | "pending" | "attention" | "success" | "danger";
