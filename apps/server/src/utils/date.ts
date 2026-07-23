export const resolveEffectiveDate = (
  payloadValue?: string | null,
  existingValue?: Date | string | null,
): Date | null => {
  const raw = payloadValue ?? existingValue;

  if (!raw) {
    return null;
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const toMidnight = (date: Date): Date =>
  new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
