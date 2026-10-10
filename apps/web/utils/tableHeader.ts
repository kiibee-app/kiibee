import { TFunction } from "i18next";

export const REGISTRATION_TABLE_HEADER_KEYS = [
  "name",
  "email",
  "date",
  "action",
] as const;

export const SALES_TABLE_HEADER_KEYS = [
  "name",
  "email",
  "price",
  "type",
  "date",
] as const;

export const buildHeaderMap = <TValue extends string>(
  headers: string[],
  headerKeys: readonly TValue[],
) =>
  headers.reduce(
    (acc, header, index) => {
      acc[header] = headerKeys[index];
      return acc;
    },
    {} as Record<string, TValue>,
  );

export const getCollectionColumns = (t: TFunction) => [
  { label: t("contents.tableHeaders.collectionName"), key: "name" },
  { label: t("contents.tableHeaders.numberOfContents"), key: "contentsCount" },
  { label: t("contents.tableHeaders.created"), key: "createdAt" },
  { label: "", key: "Actions" },
];

export const getCollectionContentColumns = (t: TFunction) => [
  { label: t("contents.tableHeaders.contentName"), key: "name" },
  { label: t("contents.tableHeaders.visibility"), key: "visibility" },
  { label: t("contents.tableHeaders.created"), key: "createdAt" },
  { label: "", key: "Actions" },
];

export const getCouponTableColumns = (t: TFunction) => [
  { label: t("contents.tableHeaders.title"), key: "title" },
  { label: t("contents.tableHeaders.codes"), key: "codes" },
  { label: t("contents.tableHeaders.status"), key: "status" },
  { label: t("contents.tableHeaders.createdDate"), key: "createdAt" },
  { label: "", key: "action" },
];

export const COLLECTION_COLUMNS = [
  { label: "Collection Name", key: "name" },
  { label: "Number of Contents", key: "contentsCount" },
  { label: "Created", key: "createdAt" },
  { label: "", key: "Actions" },
] as const;

export const COLLECTION_CONTENT_COLUMNS = [
  { label: "Content name", key: "name" },
  { label: "Visibility", key: "visibility" },
  { label: "Created", key: "createdAt" },
  { label: "", key: "Actions" },
] as const;

export const COUPON_TABLE_COLUMNS = [
  { label: "Title", key: "title" },
  { label: "Codes", key: "codes" },
  { label: "Status", key: "status" },
  { label: "Created date", key: "createdAt" },
  { label: "", key: "action" },
] as const;
export const BILLING_HISTORY_HEADER_KEYS = [
  "contentTitle",
  "creatorName",
  "type",
  "paymentDate",
  "amount",
  "paymentMethod",
] as const;

export const BILLING_HISTORY_KEY_MAP = {
  CONTENT_TITLE: BILLING_HISTORY_HEADER_KEYS[0],
  PAYMENT_METHOD: BILLING_HISTORY_HEADER_KEYS[5],
} as const;

export const COUPON_SEARCH_KEYS = {
  TITLE: "title",
  CODES: "codes",
} as const;

export type CouponSearchKey =
  (typeof COUPON_SEARCH_KEYS)[keyof typeof COUPON_SEARCH_KEYS];

export const SEARCH_FILTERS = (t: TFunction) =>
  [
    {
      placeholder: t("contents.couponSearch.title"),
      key: COUPON_SEARCH_KEYS.TITLE,
    },
    {
      placeholder: t("contents.couponSearch.codes"),
      key: COUPON_SEARCH_KEYS.CODES,
    },
  ] as const;
