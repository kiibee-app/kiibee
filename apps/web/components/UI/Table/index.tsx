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
  RightSection,
  NoDataCell,
} from "./styles";
import { useTranslation } from "react-i18next";
import { ArrowIcon } from "@/assets/icons";
import { Directions } from "@/utils/ui";
import { MonoText } from "../Monotext";
import COLORS from "@repo/ui/colors";

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
}

export default function Table<T extends Record<string, unknown>>({
  headers,
  data,
  headerToKey,
  renderCell,
  getRowKey,
  getMobileTitle,
  emptyText,
}: TableProps<T>) {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  const getKey = (header: string): KeyOf<T> => {
    if (headerToKey) return headerToKey(header);
    return header.toLowerCase().replace(/\s+/g, "") as KeyOf<T>;
  };

  const hasData = data?.length > 0;

  const defaultRenderCell = (value: unknown) =>
    value !== null && value !== undefined ? String(value) : "-";

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
            data.map((row, rowIndex) => {
              const rowKey = getRowKey?.(row, rowIndex) ?? `${rowIndex}`;

              return (
                <DesktopRow key={rowKey}>
                  {headers.map((header, colIndex) => {
                    const key = getKey(header);
                    const value = row[key];

                    const isFirstColumn = colIndex === 0;

                    return (
                      <TableCell key={header}>
                        {renderCell ? (
                          renderCell({
                            header,
                            value,
                            row,
                            rowIndex,
                          })
                        ) : isFirstColumn ? (
                          <MonoText $use="Body_SemiBold">
                            {defaultRenderCell(value)}
                          </MonoText>
                        ) : (
                          <MonoText
                            $use="Body_SemiBold"
                            color={COLORS.neutral.GRAY}
                          >
                            {defaultRenderCell(value)}
                          </MonoText>
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
          data.map((row, rowIndex) => {
            const rowKey = getRowKey?.(row, rowIndex) ?? `${rowIndex}`;

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
                      <div
                        key={header}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "6px 0",
                        }}
                      >
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
                            rowIndex,
                          })
                        ) : (
                          defaultRenderCell(value)
                        )}
                      </div>
                    );
                  })}
                </AccordionContent>
              </MobileRow>
            );
          })}
      </div>
    </TableContainer>
  );
}
