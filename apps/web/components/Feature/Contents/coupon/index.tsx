"use client";

import React, { useMemo, useState } from "react";
import Table from "@/components/UI/Table";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { ThreeDotIcon } from "@/assets/icons";
import {
  SORT_DIRECTIONS,
  SortDirectionWithNone,
  TABLE_ALIGN,
} from "@/utils/ui";
import {
  ActionWrapper,
  CodeBadge,
  CodesWrapper,
  StatusBadge,
  TableSection,
} from "./styles";
import { CouponRow } from "@/types/couponType";
import { CONTENTS as CONTENTS_KEYS } from "@/utils/translationKeys";
import { COUPON_TABLE_COLUMNS } from "@/utils/tableHeader";
import InfoTextCard from "@/components/UI/InfoTextCard";
import { useTranslation } from "react-i18next";

type CouponTableProps = {
  data: CouponRow[];
};

export default function CouponTable({ data }: CouponTableProps) {
  const { t } = useTranslation();
  const [nameSortDirection, setNameSortDirection] =
    useState<SortDirectionWithNone>(SORT_DIRECTIONS.NONE);

  const sortedRows = useMemo(() => {
    if (nameSortDirection === SORT_DIRECTIONS.NONE) return data;
    return [...data].sort((a, b) => {
      const first = a.title.toLowerCase();
      const second = b.title.toLowerCase();
      return nameSortDirection === SORT_DIRECTIONS.ASC
        ? first.localeCompare(second)
        : second.localeCompare(first);
    });
  }, [data, nameSortDirection]);

  const resolveHeaderToKey = (header: string) => {
    const col = COUPON_TABLE_COLUMNS.find((c) => c.label === header);
    return col?.key as keyof CouponRow;
  };

  const handleHeaderClick = (
    header: string,
    setSort: React.Dispatch<React.SetStateAction<SortDirectionWithNone>>,
  ) => {
    if (header !== COUPON_TABLE_COLUMNS[0].label) return;

    setSort((prev) => {
      if (prev === SORT_DIRECTIONS.NONE) return SORT_DIRECTIONS.ASC;
      if (prev === SORT_DIRECTIONS.ASC) return SORT_DIRECTIONS.DESC;
      return SORT_DIRECTIONS.NONE;
    });
  };

  return (
    <>
      <InfoTextCard
        title={t(CONTENTS_KEYS.couponsCard.title)}
        description={t(CONTENTS_KEYS.couponsCard.description)}
      />
      <TableSection>
        <Table<CouponRow>
          headers={[...COUPON_TABLE_COLUMNS.map((c) => c.label)]}
          data={sortedRows}
          rowsPerPage={10}
          headerToKey={resolveHeaderToKey}
          onHeaderClick={(header) =>
            handleHeaderClick(header, setNameSortDirection)
          }
          isHeaderSortable={(header) =>
            header === COUPON_TABLE_COLUMNS[0].label
          }
          getHeaderSortDirection={(header) =>
            header === COUPON_TABLE_COLUMNS[0].label &&
            nameSortDirection !== SORT_DIRECTIONS.NONE
              ? nameSortDirection
              : null
          }
          getRowKey={(row, index) => `${row.title}-${index}`}
          getColumnAlignment={(_header, index) =>
            index === 0 || index === 1 ? TABLE_ALIGN.LEFT : TABLE_ALIGN.CENTER
          }
          renderCell={({ header, row }) => {
            const typedHeader = COUPON_TABLE_COLUMNS.find(
              (c) => c.label === header,
            );
            if (typedHeader === COUPON_TABLE_COLUMNS[1]) {
              return (
                <CodesWrapper>
                  {row.codes.map((code) => (
                    <CodeBadge key={code}>{code}</CodeBadge>
                  ))}
                </CodesWrapper>
              );
            }

            if (typedHeader === COUPON_TABLE_COLUMNS[2]) {
              return (
                <StatusBadge $status={row.status}>
                  <MonoText $use="Body_Bold">{row.status}</MonoText>
                </StatusBadge>
              );
            }

            if (typedHeader === COUPON_TABLE_COLUMNS[4]) {
              return (
                <ActionWrapper>
                  <ThreeDotIcon />
                </ActionWrapper>
              );
            }
            const key = typedHeader?.key as keyof CouponRow;
            return (
              <MonoText
                $use="Body_SemiBold"
                color={
                  typedHeader === COUPON_TABLE_COLUMNS[0]
                    ? COLORS.primary.BLACK
                    : COLORS.neutral.GRAY
                }
              >
                {row[key]}
              </MonoText>
            );
          }}
        />
      </TableSection>
    </>
  );
}
