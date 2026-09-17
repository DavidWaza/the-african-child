import type { IconName } from "@/lib/icons";
import type { CanonicalStatus, StatusKind, StatusTone } from "./types";

export interface StatusDefinition {
  label: string;
  icon: IconName;
  tone: StatusTone;
}

export const STATUS_REGISTRY: { [K in StatusKind]: Record<CanonicalStatus<K>, StatusDefinition> } = {
  child: {
    active: { label: "Active", icon: "complete", tone: "success" },
    pending_review: { label: "Pending review", icon: "pending", tone: "pending" },
    graduated: { label: "Graduated", icon: "graduation", tone: "info" },
    withdrawn: { label: "Withdrawn", icon: "failed", tone: "neutral" },
  },
  contribution: {
    paid: { label: "Paid", icon: "complete", tone: "success" },
    processing: { label: "Processing", icon: "pending", tone: "pending" },
    failed: { label: "Failed", icon: "failed", tone: "danger" },
  },
  pledge: {
    active: { label: "Active", icon: "complete", tone: "success" },
    paused: { label: "Paused", icon: "pending", tone: "pending" },
    cancelled: { label: "Cancelled", icon: "failed", tone: "neutral" },
  },
  performance: {
    excellent: { label: "Excellent", icon: "sparkle", tone: "success" },
    good: { label: "Good", icon: "complete", tone: "info" },
    average: { label: "Average", icon: "info", tone: "pending" },
    needs_support: { label: "Needs support", icon: "attention", tone: "attention" },
  },
};

export const UNKNOWN_STATUS: StatusDefinition = { label: "Unknown", icon: "info", tone: "neutral" };
