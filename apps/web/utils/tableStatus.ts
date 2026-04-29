export const STATUS_COLUMN_KEY = "status";

export const TABLE_STATUS = {
  COMPLETED: "completed",
  PENDING: "pending",
  REJECTED: "rejected",
} as const;

export const toNormalizedStatus = (value: string) => value.toLowerCase();
