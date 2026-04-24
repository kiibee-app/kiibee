"use client";

import React, { useState } from "react";
import {
  TableContainer,
  TableWrapper,
  DesktopRow,
  DesktopHeaderRow,
  TableHead,
  TableCell,
  MobileRow,
  MobileHeader,
  AccordionContent,
  HeaderLabel,
  MobileDataRow,
  RightSection,
  NoDataCell,
  StatusBadge,
  PaginationButton,
  PaginationWrapper,
  PageNumberButton,
} from "./styles";
import { useTranslation } from "react-i18next";
import { ArrowIcon } from "@/assets/icons";
import { Directions } from "@/utils/ui";
import { STATUS_COLUMN_KEY, toNormalizedStatus } from "@/utils/tableStatus";
import { MonoText } from "../Monotext";
import COLORS from "@repo/ui/colors";
import { useTablePagination } from "./useTablePagination";

type KeyOf<T> = keyof T & string;

interface TableProps<T> {
  headers: string[];
  data: T[];
  headerToKey?: (header: string) => KeyOf<T>;
  renderCell?: (params: {
    header: string;
    value: unknown;
    row: T;
    rowIndex: number;
  }) => React.ReactNode;
  getRowKey?: (row: T, index: number) => string | number;
  getMobileTitle?: (row: T) => string;
  emptyText?: string;
  rowsPerPage?: number;
}

export default function Table<T extends Record<string, unknown>>({
  headers,
  data,
  headerToKey,
  renderCell,
  getRowKey,
  getMobileTitle,
  emptyText,
  rowsPerPage = 3,
}: TableProps<T>) {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleAccordion = (index: number) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  const getKey = (header: string): KeyOf<T> => {
    if (headerToKey) return headerToKey(header);
    return header.toLowerCase().replace(/\s+/g, "") as KeyOf<T>;
  };

  const hasData = data?.length > 0;
  const {
    effectiveRowsPerPage,
    totalPages,
    safeCurrentPage,
    paginatedData,
    pageNumbers,
  } = useTablePagination({
    data,
    rowsPerPage,
    currentPage,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    setOpenIndex(null);
  };

  const defaultRenderCell = (value: unknown) =>
    value !== null && value !== undefined ? String(value) : "-";

  const renderDefaultCell = (header: string, value: unknown) => {
    const cellValue = defaultRenderCell(value);
    const isStatusColumn = header.toLowerCase() === STATUS_COLUMN_KEY;

    if (isStatusColumn) {
      return (
        <StatusBadge type="button" $status={toNormalizedStatus(cellValue)}>
          <MonoText $use="Body_Bold" color={COLORS.primary.WHITE}>
            {cellValue}
          </MonoText>
        </StatusBadge>
      );
    }

    return cellValue;
  };

  return (
    <TableContainer>
      <TableWrapper>
        <thead>
          <DesktopHeaderRow>
            {headers.map((header) => (
              <TableHead key={header}>
                <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
                  {header}
                </MonoText>
              </TableHead>
            ))}
          </DesktopHeaderRow>
        </thead>

        <tbody>
          {hasData ? (
            paginatedData.map((row, rowIndex) => {
              const globalIndex =
                (safeCurrentPage - 1) * effectiveRowsPerPage + rowIndex;
              const rowKey = getRowKey?.(row, globalIndex) ?? `${globalIndex}`;

              return (
                <DesktopRow key={rowKey}>
                  {headers.map((header, colIndex) => {
                    const key = getKey(header);
                    const value = row[key];
                    const renderedDefaultCell = renderDefaultCell(
                      header,
                      value,
                    );

                    const isFirstColumn = colIndex === 0;

                    return (
                      <TableCell key={header}>
                        {renderCell ? (
                          renderCell({
                            header,
                            value,
                            row,
                            rowIndex: globalIndex,
                          })
                        ) : isFirstColumn ? (
                          <MonoText $use="Body_SemiBold">
                            {defaultRenderCell(value)}
                          </MonoText>
                        ) : typeof renderedDefaultCell === "string" ? (
                          <MonoText
                            $use="Body_SemiBold"
                            color={COLORS.neutral.GRAY}
                          >
                            {renderedDefaultCell}
                          </MonoText>
                        ) : (
                          renderedDefaultCell
                        )}
                      </TableCell>
                    );
                  })}
                </DesktopRow>
              );
            })
          ) : (
            <tr>
              <td colSpan={headers.length}>
                <NoDataCell>{emptyText ?? t("No Data Found")}</NoDataCell>
              </td>
            </tr>
          )}
        </tbody>
      </TableWrapper>

      <div>
        {hasData &&
          paginatedData.map((row, rowIndex) => {
            const globalIndex =
              (safeCurrentPage - 1) * effectiveRowsPerPage + rowIndex;
            const rowKey = getRowKey?.(row, globalIndex) ?? `${globalIndex}`;

            const mobileTitle =
              getMobileTitle?.(row) ?? String(Object.values(row)[0] ?? "");

            return (
              <MobileRow key={rowKey} $isOpen={openIndex === rowIndex}>
                <MobileHeader onClick={() => toggleAccordion(rowIndex)}>
                  <MonoText $use="Body_Medium">{mobileTitle}</MonoText>

                  <RightSection>
                    {openIndex === rowIndex ? (
                      <ArrowIcon direction={Directions.UP} />
                    ) : (
                      <ArrowIcon direction={Directions.DOWN} />
                    )}
                  </RightSection>
                </MobileHeader>

                <AccordionContent $isOpen={openIndex === rowIndex}>
                  {headers.map((header, colIndex) => {
                    const key = getKey(header);
                    const value = row[key];

                    const isFirstColumn = colIndex === 0;

                    return (
                      <MobileDataRow key={header}>
                        <HeaderLabel>{header}</HeaderLabel>

                        {isFirstColumn ? (
                          <MonoText
                            $use="Body_SemiBold"
                            color={COLORS.neutral.GRAY}
                          >
                            {defaultRenderCell(value)}
                          </MonoText>
                        ) : renderCell ? (
                          renderCell({
                            header,
                            value,
                            row,
                            rowIndex: globalIndex,
                          })
                        ) : (
                          renderDefaultCell(header, value)
                        )}
                      </MobileDataRow>
                    );
                  })}
                </AccordionContent>
              </MobileRow>
            );
          })}
      </div>

      {totalPages > 1 && (
        <PaginationWrapper>
          <PaginationButton
            type="button"
            onClick={() => handlePageChange(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
          >
            <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
              Previous
            </MonoText>
          </PaginationButton>

          {pageNumbers.map((pageNumber) => (
            <PageNumberButton
              key={pageNumber}
              type="button"
              $active={pageNumber === safeCurrentPage}
              onClick={() => handlePageChange(pageNumber)}
            >
              <MonoText
                $use="Body_Medium"
                color={
                  pageNumber === safeCurrentPage
                    ? COLORS.primary.WHITE
                    : COLORS.neutral.GRAY
                }
              >
                {pageNumber}
              </MonoText>
            </PageNumberButton>
          ))}

          <PaginationButton
            type="button"
            onClick={() => handlePageChange(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
          >
            <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
              Next
            </MonoText>
          </PaginationButton>
        </PaginationWrapper>
      )}
    </TableContainer>
  );
}
