/** Strips non-digit characters (phone, bank reg/account, card digits, etc.). */
export function sanitizeDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Allows digits and at most one decimal point. */
export function sanitizeDecimal(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const dotIndex = cleaned.indexOf(".");
  if (dotIndex === -1) return cleaned;
  const whole = cleaned.slice(0, dotIndex);
  const fraction = cleaned.slice(dotIndex + 1).replace(/\./g, "");
  return `${whole}.${fraction}`;
}

/** Whole-number percentage, capped at 100. */
export function sanitizePercentage(value: string): string {
  const digits = sanitizeDigits(value);
  if (!digits) return "";
  const parsed = Number.parseInt(digits, 10);
  return String(Math.min(100, parsed));
}
