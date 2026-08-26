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

export const PAYOUT_TAB_QUERY = "tab";

export function isPayoutTab(
  value: string | null | undefined,
): value is PayoutTab {
  return payoutTabs.some((tab) => tab.key === value);
}

export function payoutTabHref(tab: PayoutTab = "balances") {
  if (tab === "balances") return "/payout";
  return `/payout?${PAYOUT_TAB_QUERY}=${tab}`;
}

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

export type AccountDetailsMethodType = "bank" | "card";

export type AccountDetailsFormValues = {
  methodType: AccountDetailsMethodType;
  accountNumber: string;
  accountHolderName: string;
  bankName: string;
  cardNumber: string;
  cardExpiry: string;
};

export type AccountDetailsFormErrors = Partial<
  Record<
    | "accountNumber"
    | "accountHolderName"
    | "bankName"
    | "cardNumber"
    | "cardExpiry",
    string
  >
>;

export function formatAdminCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

export function formatAdminCardExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function validateAccountDetailsForm(
  values: AccountDetailsFormValues,
): AccountDetailsFormErrors {
  const errors: AccountDetailsFormErrors = {};
  const holder = values.accountHolderName.trim();

  if (!holder) {
    errors.accountHolderName = "Name is required";
  } else if (holder.length < 2) {
    errors.accountHolderName = "Enter at least 2 characters";
  } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ .'-]+$/.test(holder)) {
    errors.accountHolderName = "Enter a valid name";
  }

  if (values.methodType === "bank") {
    const accountNumber = values.accountNumber.replace(/\s/g, "");
    const bankName = values.bankName.trim();

    if (!accountNumber) {
      errors.accountNumber = "Account number is required";
    } else if (!/^\d{6,20}$/.test(accountNumber)) {
      errors.accountNumber = "Enter 6–20 digits";
    }

    if (!bankName) {
      errors.bankName = "Bank name is required";
    } else if (bankName.length < 2) {
      errors.bankName = "Enter at least 2 characters";
    }
  } else {
    const cardDigits = values.cardNumber.replace(/\D/g, "");
    const expiry = values.cardExpiry.trim();

    if (!cardDigits) {
      errors.cardNumber = "Card number is required";
    } else if (cardDigits.length < 13 || cardDigits.length > 19) {
      errors.cardNumber = "Enter 13–19 digits";
    }

    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!expiry) {
      errors.cardExpiry = "Validity is required";
    } else if (!match) {
      errors.cardExpiry = "Use MM/YY format";
    } else {
      const month = Number(match[1]);
      const year = Number(`20${match[2]}`);
      if (month < 1 || month > 12) {
        errors.cardExpiry = "Invalid month";
      } else {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        if (
          year < currentYear ||
          (year === currentYear && month < currentMonth)
        ) {
          errors.cardExpiry = "Card is expired";
        }
      }
    }
  }

  return errors;
}
