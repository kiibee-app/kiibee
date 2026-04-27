"use client";

import React from "react";
import {
  TableWrapper,
  DesktopRow,
  DesktopHeaderRow,
  TableHead,
  TableCell,
  NoDataCell,
  StatusBadge,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import {
  defaultRender,
  isStatusColumn,
  renderStatus,
} from "@/utils/tableRender";
import { BaseTableProps, KeyOf } from "@/types/tableContract";

export default function DesktopTable<T extends Record<string, unknown>>({
  headers,
  data,
  headerToKey,
  renderCell,
  getRowKey,
  emptyText,
  hasData,
  pagination,
}: BaseTableProps<T>) {
  const getKey = (header: string): KeyOf<T> =>
    headerToKey
      ? headerToKey(header)
      : (header.toLowerCase().replace(/\s+/g, "") as KeyOf<T>);

  if (!hasData) {
    return (
      <TableWrapper>
        <tbody>
          <tr>
            <td colSpan={headers.length}>
              <NoDataCell>{emptyText ?? "No Data Found"}</NoDataCell>
            </td>
          </tr>
        </tbody>
      </TableWrapper>
    );
  }

  return (
    <TableWrapper>
      <thead>
        <DesktopHeaderRow>
          {headers.map((h) => (
            <TableHead key={h}>
              <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
                {h}
              </MonoText>
            </TableHead>
          ))}
        </DesktopHeaderRow>
      </thead>

      <tbody>
        {data.map((row, i) => {
          const safeCurrentPage = pagination?.safeCurrentPage ?? 1;
          const effectiveRowsPerPage =
            pagination?.effectiveRowsPerPage ?? data.length;

          const globalIndex = (safeCurrentPage - 1) * effectiveRowsPerPage + i;

          const rowKey = getRowKey?.(row, globalIndex) ?? globalIndex;

          return (
            <DesktopRow key={rowKey}>
              {headers.map((header, colIndex) => {
                const key = getKey(header);
                const value = row[key];

                const isFirst = colIndex === 0;

                if (renderCell) {
                  return (
                    <TableCell key={header}>
                      {renderCell({
                        header,
                        value,
                        row,
                        rowIndex: globalIndex,
                      })}
                    </TableCell>
                  );
                }

                const rawValue = defaultRender(value);
                const content = isStatusColumn(header) ? (
                  <StatusBadge $status={renderStatus(value)}>
                    {rawValue}
                  </StatusBadge>
                ) : (
                  rawValue
                );

                return (
                  <TableCell key={header}>
                    <MonoText
                      $use="Body_SemiBold"
                      color={isFirst ? undefined : COLORS.neutral.GRAY}
                    >
                      {content}
                    </MonoText>
                  </TableCell>
                );
              })}
            </DesktopRow>
          );
        })}
      </tbody>
    </TableWrapper>
  );
}
