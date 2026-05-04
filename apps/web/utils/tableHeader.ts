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
