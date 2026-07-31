import { PAYOUT_BALANCE_API_ERRORS } from "@/utils/Constants";
export const MIN_PAYOUT_AMOUNT = 8;

export type PayoutRow = {
  label: string;
  value: string;
};

export function parsePayoutBalance(value?: string | null): number {
  if (!value) return 0;

  const match = value.match(/(-?\d+(?:[.,]\d+)?)/);
  if (!match) return 0;

  const amount = Number(match[1].replace(",", "."));
  return Number.isNaN(amount) ? 0 : amount;
}

export function formatPayoutAmount(value: string): string {
  const match = value.match(/^(-?\d+(?:[.,]\d+)?)\s*kr\.?$/i);

  if (!match) {
    return value;
  }

  const amount = Number(match[1].replace(",", "."));

  if (Number.isNaN(amount)) {
    return value;
  }

  return formatPayoutNumber(amount);
}

export function formatPayoutNumber(amount: number): string {
  const formattedAmount = new Intl.NumberFormat("da-DK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${formattedAmount} kr.`;
}

export function formatFeePercent(ratio: number): string {
  const percent = Number((ratio * 100).toFixed(2));
  return `${percent}%`;
}

export function isPayoutBalanceError(message?: string | null): boolean {
  if (!message) return false;

  const normalized = message.trim().toLowerCase();
  return PAYOUT_BALANCE_API_ERRORS.some(
    (errorMessage) => errorMessage.toLowerCase() === normalized,
  );
}

export const CENTER_ALIGNED_HEADERS = ["Status", "Credit No", "Bank", "Date"];
