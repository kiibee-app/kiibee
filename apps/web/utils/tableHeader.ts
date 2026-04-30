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
