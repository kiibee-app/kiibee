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

export const getPasswordCount = (hash: unknown): number => {
  if (typeof hash !== "string" || !hash) return 0;
  if (!hash.startsWith("[") || !hash.endsWith("]")) {
    return 1;
  }

  try {
    const parsed = JSON.parse(hash);
    return Array.isArray(parsed) ? parsed.length : 1;
  } catch {
    return 1;
  }
};

type AccessSource = Record<string, unknown>;

export const checkHasPriceOrCode = (source?: unknown): boolean => {
  if (!source || typeof source !== "object") return false;
  const item = source as AccessSource;

  const normalizeAccessValue = (value: unknown): string =>
    String(value ?? "")
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/[_\-\s]+/g, " ")
      .toLowerCase();

  const checkSingle = (value: unknown): boolean => {
    if (!value || typeof value !== "object") return false;
    const obj = value as AccessSource;

    if (obj.isFree === false || obj.is_free === false || obj.free === false)
      return true;
    if (Boolean(obj.isPaid) || Boolean(obj.is_paid) || Boolean(obj.paid))
      return true;
    if (Boolean(obj.isPaidCollection) || Boolean(obj.is_paid_collection))
      return true;
    if (Boolean(obj.isPasswordProtected) || Boolean(obj.is_password_protected))
      return true;
    if (Boolean(obj.hasAccessCode) || Boolean(obj.has_access_code)) return true;
    if (Boolean(obj.isEmailGated) || Boolean(obj.is_email_gated)) return true;

    const buyPrice =
      obj.buyPrice ??
      obj.buy_price ??
      obj.purchaseAmount ??
      obj.purchase_amount ??
      obj.price ??
      obj.amount;
    if (buyPrice != null && Number(buyPrice) > 0) return true;

    const rentPrice =
      obj.rentPrice ?? obj.rent_price ?? obj.rentalAmount ?? obj.rental_amount;
    if (rentPrice != null && Number(rentPrice) > 0) return true;

    const hasPass =
      Boolean(obj.hasPassword) ||
      Boolean(obj.has_password) ||
      Number(obj.passwordCount ?? 0) > 0 ||
      Boolean(obj.passwordHash) ||
      Boolean(obj.password_hash) ||
      (typeof obj.password === "string" && obj.password.trim().length > 0) ||
      (Array.isArray(obj.passwords) && obj.passwords.length > 0) ||
      (typeof obj.passwords === "string" && obj.passwords.trim().length > 0);

    if (hasPass) return true;

    const normAccess = normalizeAccessValue(
      obj.accessType ??
        obj.access_type ??
        obj.admissionRequirement ??
        obj.admission_requirement ??
        obj.actions ??
        obj.type ??
        "",
    );

    if (!normAccess) return false;

    const protectedAccessTokens = [
      "paid",
      "payment",
      "purchase",
      "rent",
      "password",
      "set password",
      "access code",
      "code",
      "email",
      "email gated",
      "request email",
    ];

    return protectedAccessTokens.some((token) => normAccess.includes(token));
  };

  if (checkSingle(item)) return true;

  const nested =
    item.setting ??
    item.settings ??
    item.contentSetting ??
    item.content_setting ??
    item.accessSetting ??
    item.access_setting ??
    item.accessInfo ??
    item.access_info ??
    item.admission ??
    item.collection;

  if (nested && checkSingle(nested)) return true;

  return false;
};
