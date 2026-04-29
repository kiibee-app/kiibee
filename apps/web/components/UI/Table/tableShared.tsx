import React from "react";
import { MonoText } from "@/components/UI/Monotext";
import { StatusBadge } from "./styles";
import {
  defaultRender,
  isStatusColumn,
  renderStatus,
} from "@/utils/tableRender";
import { KeyOf } from "@/types/tableContract";

export const getColumnKey = <T extends Record<string, unknown>>(
  header: string,
  headerToKey?: (h: string) => KeyOf<T>,
): KeyOf<T> => {
  return headerToKey
    ? headerToKey(header)
    : (header.toLowerCase().replace(/\s+/g, "") as KeyOf<T>);
};

export const getGlobalIndex = (
  index: number,
  pagination?: {
    safeCurrentPage?: number;
    effectiveRowsPerPage?: number;
  },
  fallbackLength = 0,
) => {
  const safeCurrentPage = pagination?.safeCurrentPage ?? 1;
  const effectiveRowsPerPage =
    pagination?.effectiveRowsPerPage ?? fallbackLength;

  return (safeCurrentPage - 1) * effectiveRowsPerPage + index;
};

export const renderDefaultCellContent = (header: string, value: unknown) => {
  const rawValue = defaultRender(value);

  if (isStatusColumn(header)) {
    return (
      <StatusBadge $status={renderStatus(value)}>
        <MonoText $use="Body_Bold" color="inherit">
          {rawValue}
        </MonoText>
      </StatusBadge>
    );
  }

  return rawValue;
};
