"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  TableWrapper,
  ClickableDesktopRow,
  DesktopHeaderRow,
  TableHead,
  HeaderContent,
  TableCell,
  NoDataCell,
} from "./styles";
import { DirectionIcon } from "@/assets/icons";
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
  onRowClick,
  onHeaderClick,
  isHeaderSortable,
  getHeaderSortDirection,
}: BaseTableProps<T>) {
  const { t } = useTranslation();

  if (!hasData) {
    return (
      <TableWrapper>
        <tbody>
          <tr>
            <td colSpan={headers.length}>
              <NoDataCell>{emptyText ?? t("table.noData")}</NoDataCell>
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
          {headers.map((header, index) => {
            const sortable = isHeaderSortable?.(header, index) ?? false;
            const sortDirection = getHeaderSortDirection?.(header) ?? null;

            return (
              <TableHead
                key={header}
                $align={getColumnAlignment?.(header, index)}
                $clickable={sortable}
                onClick={
                  sortable ? () => onHeaderClick?.(header, index) : undefined
                }
              >
                <HeaderContent>
                  <MonoText
                    $use="Body_Medium"
                    color={
                      sortDirection ? COLORS.primary.BLACK : COLORS.neutral.GRAY
                    }
                  >
                    {header}
                  </MonoText>
                  {sortDirection ? (
                    <DirectionIcon
                      width={12}
                      height={12}
                      direction={sortDirection}
                      color={COLORS.primary.BLACK}
                    />
                  ) : null}
                </HeaderContent>
              </TableHead>
            );
          })}
        </DesktopHeaderRow>
      </thead>

      <tbody>
        {data.map((row, index) => {
          const globalIndex = getGlobalIndex(index, pagination, data.length);
          const rowKey = getRowKey?.(row, globalIndex) ?? globalIndex;
          const clickable = Boolean(onRowClick);

          return (
            <ClickableDesktopRow
              key={rowKey}
              $clickable={clickable}
              onClick={
                clickable ? () => onRowClick?.(row, globalIndex) : undefined
              }
            >
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
            </ClickableDesktopRow>
          );
        })}
      </tbody>
    </TableWrapper>
  );
}
