import { toCreatorStatus } from "./status";
import type { PayoutTab, BadgeStatus } from "../types/payout-request";

/** Gross payout amount must be greater than this (DKK). */
export const MIN_PAYOUT_AMOUNT = 8;

export const payoutTabs: Array<{ key: PayoutTab; label: string }> = [
  { key: "balances", label: "Creator Balances" },
  { key: "requests", label: "Payout Requests" },
  { key: "creator-history", label: "History by Creator" },
  { key: "all-history", label: "All History" },
];

export function formatDate(value?: string | null) {
  if (!value) return "N/A";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatAmount(
  amount?: string | number | null,
  currency?: string | null,
) {
  if (amount === undefined || amount === null || amount === "") return "N/A";
  return `${amount}${currency ? ` ${currency}` : ""}`;
}

export function toPayoutBadgeStatus(status: string): BadgeStatus {
  if (status === "completed") return "approved";
  return toCreatorStatus(status);
}
