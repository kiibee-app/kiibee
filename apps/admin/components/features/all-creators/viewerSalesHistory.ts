export const INITIAL_SALES_HISTORY_COUNT = 4;

export function formatSaleType(type: string) {
  if (!type) return "";
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}
