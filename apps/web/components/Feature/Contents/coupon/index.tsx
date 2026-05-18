"use client";

import React, { useMemo, useState } from "react";
import Table from "@/components/UI/Table";
import SortDropdown, { DropdownOption } from "@/components/UI/SortDropdown";
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
  CouponActionText,
  StatusBadge,
  TableSection,
} from "./styles";
import { COUPON_STATUS, CouponRow, CouponStatus } from "@/types/couponType";
import { CONTENTS as CONTENTS_KEYS } from "@/utils/translationKeys";
import { COUPON_TABLE_COLUMNS } from "@/utils/tableHeader";
import InfoTextCard from "@/components/UI/InfoTextCard";
import { useTranslation } from "react-i18next";
import {
  COUPON_ACTION_DELETE,
  COUPON_ACTION_EDIT,
  COUPON_ACTION_STATUS,
  CouponAction,
  SORT_DROPDOWN_VARIANT,
} from "@/utils/Constants";

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

  const getCouponActionOptions = (
    status: CouponStatus,
  ): DropdownOption<CouponAction>[] => [
    {
      label: t(CONTENTS_KEYS.couponActions.editCoupon),
      value: COUPON_ACTION_EDIT,
    },
    {
      label:
        status === COUPON_STATUS.ACTIVE
          ? t(CONTENTS_KEYS.couponActions.makeInactive)
          : t(CONTENTS_KEYS.couponActions.makeActive),
      value: COUPON_ACTION_STATUS,
    },
    {
      label: t(CONTENTS_KEYS.couponActions.delete),
      value: COUPON_ACTION_DELETE,
    },
  ];

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
                  <SortDropdown<CouponAction>
                    options={getCouponActionOptions(row.status)}
                    allowNoSelection
                    compact
                    dropdownWidth="200px"
                    maxWidth="200px"
                    variant={SORT_DROPDOWN_VARIANT.SURFACE}
                    trigger={<ThreeDotIcon />}
                    renderOptionLabel={(option) => (
                      <CouponActionText
                        $danger={option.value === COUPON_ACTION_DELETE}
                      >
                        {option.label}
                      </CouponActionText>
                    )}
                  />
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
