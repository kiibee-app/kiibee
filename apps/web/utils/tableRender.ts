import { STATUS_COLUMN_KEY, toNormalizedStatus } from "@/utils/tableStatus";

export const defaultRender = (v: unknown) =>
  v !== null && v !== undefined ? String(v) : "-";

export const isStatusColumn = (header: string) =>
  header.toLowerCase() === STATUS_COLUMN_KEY;

export const renderStatus = (value: unknown) =>
  toNormalizedStatus(String(value ?? ""));
