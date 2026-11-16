import { BadRequestException } from '@nestjs/common';

export const BILLING_MONTHS = [1, 3, 6, 12] as const;
export type BillingMonths = (typeof BILLING_MONTHS)[number];
export type SubscriptionOverrides = {
  customPrice?: number | null;
  customPrice3?: number | null;
  customPrice6?: number | null;
  customPrice12?: number | null;
  customMaxFiles?: number | null;
  customKiibeeCutDkk?: number | null;
  customTransactionFeePct?: number | null;
  paymentPeriod?: string | null;
};
export function allowedBillingMonths(period?: string | null): BillingMonths[] {
  if (!period?.trim()) return [1];
  const aliases: Record<string, number> = {
    monthly: 1,
    quarterly: 3,
    semiannual: 6,
    yearly: 12,
    annually: 12,
  };
  const values = period
    .toLowerCase()
    .split(/[,;\s]+/)
    .filter(Boolean)
    .map((value) => aliases[value] ?? Number(value));
  if (
    !values.length ||
    values.some((value) => !BILLING_MONTHS.includes(value as BillingMonths))
  )
    throw new BadRequestException(
      'Payment periods must be 1, 3, 6 or 12 months',
    );
  return [...new Set(values)].sort((a, b) => a - b) as BillingMonths[];
}
export function validateSubscriptionOverrides(input: SubscriptionOverrides) {
  for (const key of [
    'customPrice',
    'customPrice3',
    'customPrice6',
    'customPrice12',
    'customMaxFiles',
    'customKiibeeCutDkk',
    'customTransactionFeePct',
  ] as const) {
    const value = input[key];
    if (value == null) continue;
    if (!Number.isSafeInteger(value) || value < 0 || value > 2_147_483_647)
      throw new BadRequestException(
        `${key} must be a non-negative whole number`,
      );
    if (key.startsWith('customPrice') && (value === 0 || value > 9_999_999))
      throw new BadRequestException(
        'Custom subscription prices must be between 1 and 9999999',
      );
    if (key === 'customTransactionFeePct' && value > 100)
      throw new BadRequestException(
        'Transaction fee must be between 0 and 100 percent',
      );
  }
  const priceCount = [
    input.customPrice,
    input.customPrice3,
    input.customPrice6,
    input.customPrice12,
  ].filter((value) => value != null).length;
  if (priceCount > 1)
    throw new BadRequestException(
      'Only one custom subscription price can be configured per creator',
    );
  if (allowedBillingMonths(input.paymentPeriod).length > 1)
    throw new BadRequestException(
      'Choose one payment period for the custom subscription',
    );
}
export function subscriptionTerms(
  basePrice: number,
  overrides: SubscriptionOverrides = {},
  requestedMonths?: number,
) {
  // Older admin forms kept the default monthly period when only a term price was entered.
  const configuredTerms = ([3, 6, 12] as const).filter(
    (months) => overrides[`customPrice${months}`] != null,
  );
  const inferTerm =
    overrides.customPrice == null &&
    configuredTerms.length === 1 &&
    (!overrides.paymentPeriod || overrides.paymentPeriod === '1');
  const allowed = inferTerm
    ? [configuredTerms[0]]
    : allowedBillingMonths(overrides.paymentPeriod);
  const months = requestedMonths ?? allowed[0];
  if (!allowed.includes(months as BillingMonths))
    throw new BadRequestException('Selected payment period is not allowed');
  const monthly = overrides.customPrice ?? basePrice;
  const prices: Record<number, number> = {
    1: monthly,
    3: overrides.customPrice3 ?? monthly * 3,
    6: overrides.customPrice6 ?? monthly * 6,
    12: overrides.customPrice12 ?? monthly * 12,
  };
  const amount = basePrice === 0 ? 0 : prices[months];
  const minorAmount = Math.round(amount * 100);
  if (
    !Number.isSafeInteger(minorAmount) ||
    minorAmount < 0 ||
    (basePrice > 0 && minorAmount === 0) ||
    minorAmount > 999_999_999
  )
    throw new BadRequestException('Subscription amount is out of range');
  return {
    months: months as BillingMonths,
    amount,
    minorAmount,
    billingOptions: allowed.map((m) => ({
      months: m,
      amount: basePrice === 0 ? 0 : prices[m],
    })),
  };
}
export function addBillingMonths(start: Date, months: number): Date {
  const end = new Date(start);
  const day = end.getUTCDate();
  end.setUTCDate(1);
  end.setUTCMonth(end.getUTCMonth() + months);
  const last = new Date(
    Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + 1, 0),
  ).getUTCDate();
  end.setUTCDate(Math.min(day, last));
  return end;
}

export function customOverridesEnabled(
  status?: string | null,
  forBilling = true,
): boolean {
  return (
    status == null || status === 'paid' || (forBilling && status === 'pending')
  );
}

// The interval alone is a form default, not a custom subscription offer.
export function hasCustomSubscriptionValues(
  overrides: SubscriptionOverrides,
): boolean {
  return [
    'customPrice',
    'customPrice3',
    'customPrice6',
    'customPrice12',
    'customMaxFiles',
    'customKiibeeCutDkk',
    'customTransactionFeePct',
  ].some((key) => overrides[key as keyof SubscriptionOverrides] != null);
}
