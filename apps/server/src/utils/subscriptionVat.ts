export const SUBSCRIPTION_VAT_RATE = 25;

// Calculate in øre so checkout, invoice and payment ledger agree exactly.
export function addSubscriptionVat(subtotal: number) {
  const subtotalMinor = Math.round(subtotal * 100);
  const vatMinor = Math.round((subtotalMinor * SUBSCRIPTION_VAT_RATE) / 100);
  const totalMinor = subtotalMinor + vatMinor;
  return {
    subtotal: subtotalMinor / 100,
    vatAmount: vatMinor / 100,
    total: totalMinor / 100,
    subtotalMinor,
    vatMinor,
    totalMinor,
    vatRate: SUBSCRIPTION_VAT_RATE,
  };
}

export function subscriptionVatEmail(checkout?: {
  subtotalMinor?: number | null;
  vatMinor?: number | null;
  vatRate?: number | null;
}) {
  if (
    checkout?.subtotalMinor == null ||
    checkout.vatMinor == null ||
    checkout.vatRate == null
  )
    return {};
  const subtotal = (checkout.subtotalMinor / 100).toFixed(2);
  const vatAmount = (checkout.vatMinor / 100).toFixed(2);
  const total = ((checkout.subtotalMinor + checkout.vatMinor) / 100).toFixed(2);
  return {
    vatDetails: [
      { label: 'Subtotal (ekskl. moms)', amount: subtotal },
      { label: `${checkout.vatRate}% moms`, amount: vatAmount },
      { label: 'TOTAL', amount: total },
    ],
  };
}
