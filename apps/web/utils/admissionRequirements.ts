export const ADMISSION_REQUIREMENT_VALUES = {
  free: "free",
  payment: "payment",
  password: "password",
  email: "email",
} as const;

export type AdmissionRequirementValue =
  (typeof ADMISSION_REQUIREMENT_VALUES)[keyof typeof ADMISSION_REQUIREMENT_VALUES];

export const DEFAULT_ADMISSION_REQUIREMENT = ADMISSION_REQUIREMENT_VALUES.free;

export const ADMISSION_REQUIREMENTS: {
  value: AdmissionRequirementValue;
  labelKey: string;
}[] = [
  {
    value: ADMISSION_REQUIREMENT_VALUES.free,
    labelKey: "contents.admissionRequirements.options.free",
  },
  {
    value: ADMISSION_REQUIREMENT_VALUES.payment,
    labelKey: "contents.admissionRequirements.options.payment",
  },
  {
    value: ADMISSION_REQUIREMENT_VALUES.password,
    labelKey: "contents.admissionRequirements.options.password",
  },
  {
    value: ADMISSION_REQUIREMENT_VALUES.email,
    labelKey: "contents.admissionRequirements.options.email",
  },
];

export const validatePasswordInput = (val: string): boolean => {
  if (!val) return false;
  const passwords = val.split(",").map((p) => p.trim());
  return passwords.some((p) => p.length > 0 && p.length < 6);
};

export const combinePasswords = (committed: string, typed: string): string =>
  [committed, typed].filter(Boolean).join(", ");
