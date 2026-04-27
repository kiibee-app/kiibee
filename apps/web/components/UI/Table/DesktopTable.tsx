"use client";

import React from "react";
import {
  TableWrapper,
  DesktopRow,
  DesktopHeaderRow,
  TableHead,
  TableCell,
  NoDataCell,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { BaseTableProps } from "@/types/tableContract";
import {
  getColumnKey,
  getGlobalIndex,
  renderDefaultCellContent,
} from "./tableShared";

export default function DesktopTable<T extends Record<string, unknown>>({
  headers,
  data,
  headerToKey,
  renderCell,
  getRowKey,
  getColumnAlignment,
  emptyText,
  hasData,
  pagination,
}: BaseTableProps<T>) {
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
          {headers.map((header, index) => (
            <TableHead
              key={header}
              $align={getColumnAlignment?.(header, index)}
            >
              <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
                {header}
              </MonoText>
            </TableHead>
          ))}
        </DesktopHeaderRow>
      </thead>

      <tbody>
        {data.map((row, index) => {
          const globalIndex = getGlobalIndex(index, pagination, data.length);
          const rowKey = getRowKey?.(row, globalIndex) ?? globalIndex;

          return (
            <DesktopRow key={rowKey}>
              {headers.map((header, colIndex) => {
                const key = getColumnKey<T>(header, headerToKey);
                const value = row[key];
                const isFirstColumn = colIndex === 0;
                const align = getColumnAlignment?.(header, colIndex);

                if (renderCell) {
                  return (
                    <TableCell key={header} $align={align}>
                      {renderCell({
                        header,
                        value,
                        row,
                        rowIndex: globalIndex,
                      })}
                    </TableCell>
                  );
                }

                const content = renderDefaultCellContent(header, value);

                return (
                  <TableCell key={header} $align={align}>
                    <MonoText
                      $use="Body_SemiBold"
                      color={isFirstColumn ? undefined : COLORS.neutral.GRAY}
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
