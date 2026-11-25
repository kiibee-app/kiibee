import { escapeHtml } from './escapeHtml';
export type PayoutBankDetails = {
  bankName: string | null;
  accountHolderName: string | null;
  registrationNumber: string | null;
  accountNumber: string | null;
};

// A recorded destination takes priority over the currently selected bank account.
export function resolvePayoutBankDetails(
  snapshot: string | null | undefined,
  selectedBank: PayoutBankDetails | null | undefined,
): PayoutBankDetails | null {
  let recorded: unknown;
  try {
    recorded = snapshot ? JSON.parse(snapshot) : null;
  } catch {
    recorded = null;
  }
  const source =
    recorded && typeof recorded === 'object' && !Array.isArray(recorded)
      ? (recorded as Record<string, unknown>)
      : selectedBank;
  if (!source) return null;
  const clean = (value: unknown) =>
    typeof value === 'string' && value.trim() ? value.trim() : null;
  const details = {
    bankName: clean(source.bankName),
    accountHolderName: clean(source.accountHolderName),
    registrationNumber: clean(source.registrationNumber),
    accountNumber: clean(source.accountNumber),
  };
  return Object.values(details).some(Boolean) ? details : null;
}

export function payoutBankEmailVariables(
  bank: PayoutBankDetails | null | undefined,
) {
  const value = (field: string | null | undefined) =>
    escapeHtml(field || 'Ikke oplyst');
  return {
    bankName: value(bank?.bankName),
    accountHolderName: value(bank?.accountHolderName),
    registrationNumber: value(bank?.registrationNumber),
    accountNumber: value(bank?.accountNumber),
  };
}
