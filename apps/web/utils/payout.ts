export type PayoutRow = {
  label: string;
  value: string;
};

export const payoutRows: PayoutRow[] = [
  {
    label: "Earnings\n(Based on 94 purchases and 39 rentals)",
    value: "149.00 kr.",
  },
  {
    label: "Transaction fee (1% per sale)",
    value: "-1.49 kr.",
  },
  {
    label: "Kiibee payment (per sale)",
    value: "-133 kr.",
  },
];

export const payoutTotal = {
  label: "Total payout amount",
  value: "14.51 kr.",
};
