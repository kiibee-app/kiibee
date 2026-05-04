"use client";

import React from "react";
import {
  MobileRow,
  ClickableMobileHeader,
  AccordionContent,
  MobileDataRow,
  HeaderLabel,
  RightSection,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import { ArrowIcon } from "@/assets/icons";
import { Directions } from "@/utils/ui";
import { MobileTableProps } from "@/types/tableContract";
import {
  getColumnKey,
  getGlobalIndex,
  renderDefaultCellContent,
} from "./tableShared";

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
  onRowClick,
}: MobileTableProps<T>) {
  if (!hasData) return null;

  return (
    <>
      {data.map((row, index) => {
        const globalIndex = getGlobalIndex(index, pagination, data.length);
        const rowKey = getRowKey?.(row, globalIndex) ?? globalIndex;
        const title =
          getMobileTitle?.(row) ?? String(Object.values(row)[0] ?? "");
        const clickable = Boolean(onRowClick);

        return (
          <MobileRow key={rowKey} $isOpen={openIndex === index}>
            <ClickableMobileHeader
              $clickable={clickable}
              onClick={
                clickable
                  ? () => onRowClick?.(row, globalIndex)
                  : () => toggleAccordion(index)
              }
            >
              <MonoText $use="Body_Medium">{title}</MonoText>

              <RightSection>
                {clickable ? null : (
                  <ArrowIcon
                    direction={
                      openIndex === index ? Directions.UP : Directions.DOWN
                    }
                  />
                )}
              </RightSection>
            </ClickableMobileHeader>

            <AccordionContent $isOpen={openIndex === index}>
              {headers.map((header) => {
                const key = getColumnKey<T>(header, headerToKey);
                const value = row[key];

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

                const content = renderDefaultCellContent(header, value);

                return (
                  <MobileDataRow key={header}>
                    <HeaderLabel>{header}</HeaderLabel>
                    <MonoText $use="Body_SemiBold">{content}</MonoText>
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
