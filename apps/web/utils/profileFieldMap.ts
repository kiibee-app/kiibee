export const PROFILE_FIELD_MAP = [
  ["firstName", "firstName"],
  ["lastName", "lastName"],
  ["company", "companyName"],
  ["phone", "phone"],
  ["cvr", "cvr"],
  ["address", "address"],
  ["city", "city"],
  ["postal", "postalCode"],
  ["reg", "regNumber"],
  ["account", "accountNumber"],
] as const;

export type CreatorProfileFormKey = (typeof PROFILE_FIELD_MAP)[number][0];
export type CreatorProfileBodyKey = (typeof PROFILE_FIELD_MAP)[number][1];
