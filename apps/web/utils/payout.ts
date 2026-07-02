export type PayoutRow = {
  label: string;
  value: string;
};

export function formatPayoutAmount(value: string): string {
  const match = value.match(/^(-?\d+(?:[.,]\d+)?)\s*kr\.?$/i);

  if (!match) {
    return value;
  }

  const amount = Number(match[1].replace(",", "."));

  if (Number.isNaN(amount)) {
    return value;
  }

  const formattedAmount = new Intl.NumberFormat("da-DK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${formattedAmount} kr.`;
}

export const payoutRows: PayoutRow[] = [
  {
    label: "Earnings\n(Based on 94 purchases and 39 rentals)",
    value: formatPayoutAmount("149.00 kr."),
  },
  {
    label: "Transaction fee (1% per sale)",
    value: formatPayoutAmount("-1.49 kr."),
  },
  {
    label: "Kiibee payment (per sale)",
    value: formatPayoutAmount("-133 kr."),
  },
];

export const payoutTotal = {
  label: "Total payout amount",
  value: formatPayoutAmount("14.51 kr."),
};

export const CENTER_ALIGNED_HEADERS = ["Status", "Credit No", "Bank", "Date"];
