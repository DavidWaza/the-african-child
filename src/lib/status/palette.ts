import type { StatusTone } from "./types";

/** Tone → classes. A design change to a tone is one edit here. */
export const STATUS_TONE_CLASSES: Record<StatusTone, { fg: string; bg: string; bd: string }> = {
  neutral: { fg: "text-base-600", bg: "bg-base-100", bd: "border-base-150" },
  info: { fg: "text-accent-600", bg: "bg-accent-50", bd: "border-accent-100" },
  pending: { fg: "text-yellow-600", bg: "bg-yellow-50", bd: "border-yellow-100" },
  attention: { fg: "text-red-600", bg: "bg-red-50", bd: "border-red-100" },
  success: { fg: "text-green-600", bg: "bg-green-50", bd: "border-green-100" },
  danger: { fg: "text-red-600", bg: "bg-red-50", bd: "border-red-150" },
};
