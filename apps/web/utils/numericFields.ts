import { FORM_KEYS } from "@/utils/creatorProfile";

export const NUMERIC_INPUT_MODE = "numeric" as const;
export const TEL_INPUT_MODE = "tel" as const;

export const CVR_MAX_LENGTH = 8;

export const CREATOR_SIGNUP_FIELD = {
  PHONE: "phone",
  CVR: "cvr",
  POSTAL_CODE: "postalCode",
} as const;

export const SUPPORT_FIELD = {
  PHONE_NUMBER: "phoneNumber",
} as const;

export const CREATOR_SIGNUP_DIGITS_ONLY_FIELDS = [
  CREATOR_SIGNUP_FIELD.PHONE,
  CREATOR_SIGNUP_FIELD.CVR,
  CREATOR_SIGNUP_FIELD.POSTAL_CODE,
] as const;

export const CREATOR_PROFILE_DIGITS_ONLY_FIELDS = [
  FORM_KEYS.phone,
  FORM_KEYS.cvr,
  FORM_KEYS.postal,
] as const;

export const CREATOR_SIGNUP_DIGITS_ONLY_SET: ReadonlySet<string> = new Set(
  CREATOR_SIGNUP_DIGITS_ONLY_FIELDS,
);

export const CREATOR_PROFILE_DIGITS_ONLY_SET: ReadonlySet<string> = new Set(
  CREATOR_PROFILE_DIGITS_ONLY_FIELDS,
);

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

export function sanitizeDigitsField(field: string, value: string): string {
  const digits = sanitizeDigits(value);
  if (field === CREATOR_SIGNUP_FIELD.CVR || field === FORM_KEYS.cvr) {
    return digits.slice(0, CVR_MAX_LENGTH);
  }
  return digits;
}

export function applyDigitsOnlyInput(
  field: string,
  value: string,
  allowed: ReadonlySet<string>,
): string {
  return allowed.has(field) ? sanitizeDigitsField(field, value) : value;
}
