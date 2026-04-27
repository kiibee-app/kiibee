"use client";

import React from "react";
import {
  MobileRow,
  MobileHeader,
  AccordionContent,
  MobileDataRow,
  HeaderLabel,
  RightSection,
  StatusBadge,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import { ArrowIcon } from "@/assets/icons";
import { Directions } from "@/utils/ui";
import {
  defaultRender,
  isStatusColumn,
  renderStatus,
} from "@/utils/tableRender";
import { MobileTableProps, KeyOf } from "@/types/tableContract";

export default function MobileTable<T extends Record<string, unknown>>({
  headers,
  data,
  headerToKey,
  renderCell,
  getRowKey,
  getMobileTitle,
  openIndex,
  toggleAccordion,
  hasData,
  pagination,
}: MobileTableProps<T>) {
  const getKey = (header: string): KeyOf<T> =>
    headerToKey
      ? headerToKey(header)
      : (header.toLowerCase().replace(/\s+/g, "") as KeyOf<T>);

  if (!hasData) return null;

  return (
    <>
      {data.map((row, i) => {
        const safeCurrentPage = pagination?.safeCurrentPage ?? 1;
        const effectiveRowsPerPage =
          pagination?.effectiveRowsPerPage ?? data.length;

        const globalIndex = (safeCurrentPage - 1) * effectiveRowsPerPage + i;

        const rowKey = getRowKey?.(row, globalIndex) ?? globalIndex;
        const title =
          getMobileTitle?.(row) ?? String(Object.values(row)[0] ?? "");

        return (
          <MobileRow key={rowKey} $isOpen={openIndex === i}>
            <MobileHeader onClick={() => toggleAccordion(i)}>
              <MonoText $use="Body_Medium">{title}</MonoText>

              <RightSection>
                <ArrowIcon
                  direction={openIndex === i ? Directions.UP : Directions.DOWN}
                />
              </RightSection>
            </MobileHeader>

            <AccordionContent $isOpen={openIndex === i}>
              {headers.map((header) => {
                const key = getKey(header);
                const value = row[key];
                const rawValue = defaultRender(value);

                if (renderCell) {
                  return (
                    <MobileDataRow key={header}>
                      <HeaderLabel>{header}</HeaderLabel>
                      {renderCell({
                        header,
                        value,
                        row,
                        rowIndex: globalIndex,
                      })}
                    </MobileDataRow>
                  );
                }

                const content = isStatusColumn(header) ? (
                  <StatusBadge $status={renderStatus(value)}>
                    {rawValue}
                  </StatusBadge>
                ) : (
                  <MonoText $use="Body_SemiBold">{rawValue}</MonoText>
                );

                return (
                  <MobileDataRow key={header}>
                    <HeaderLabel>{header}</HeaderLabel>
                    {content}
                  </MobileDataRow>
                );
              })}
            </AccordionContent>
          </MobileRow>
        );
      })}
    </>
  );
}
