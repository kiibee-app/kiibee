export function sanitizeDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function sanitizeDecimal(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const dotIndex = cleaned.indexOf(".");
  if (dotIndex === -1) return cleaned;
  const whole = cleaned.slice(0, dotIndex);
  const fraction = cleaned.slice(dotIndex + 1).replace(/\./g, "");
  return `${whole}.${fraction}`;
}

export function sanitizePercentage(value: string): string {
  const digits = sanitizeDigits(value);
  if (!digits) return "";
  const parsed = Number.parseInt(digits, 10);
  return String(Math.min(100, parsed));
}

export const CVR_MAX_LENGTH = 8;

export function sanitizeCvr(value: string): string {
  return sanitizeDigits(value).slice(0, CVR_MAX_LENGTH);
}

export type DigitsOnlyField = "phone" | "cvr" | "postalCode" | "postal";

export function sanitizeDigitsOnlyField(
  field: DigitsOnlyField,
  value: string,
): string {
  if (field === "cvr") return sanitizeCvr(value);
  return sanitizeDigits(value);
}
