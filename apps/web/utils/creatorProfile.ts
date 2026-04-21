export type PaymentKeys = "reg" | "account";
export type CompanyKeys =
  | "company"
  | "phone"
  | "cvr"
  | "address"
  | "city"
  | "postal";

export type Passwords = {
  current: string;
  next: string;
  confirm: string;
};

export const FORM_KEYS = {
  firstName: "firstName",
  lastName: "lastName",
  company: "company",
  phone: "phone",
  cvr: "cvr",
  address: "address",
  city: "city",
  postal: "postal",
  reg: "reg",
  account: "account",
} as const;

export type FormKeys = (typeof FORM_KEYS)[keyof typeof FORM_KEYS];

const CREATOR_PROFILE_UTILS = {
  FORM_KEYS,
};

export default CREATOR_PROFILE_UTILS;
