"use client";

import React, { useCallback, useMemo, useState } from "react";
import Table from "@/components/UI/Table";
import SortDropdown, { DropdownOption } from "@/components/UI/SortDropdown";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { CheckIcon, CopyIcon, ThreeDotIcon } from "@/assets/icons";
import {
  SORT_DIRECTIONS,
  SortDirectionWithNone,
  TABLE_ALIGN,
} from "@/utils/ui";
import {
  ActionWrapper,
  CodeBadge,
  CodesWrapper,
  CopyButton,
  CouponActionText,
  StatusBadge,
  TableSection,
} from "./styles";
import {
  EmptyCollectionCard,
  EmptyCollectionText,
  EmptyCollectionTitle,
} from "../styles";
import { COUPON_STATUS, CouponRow, CouponStatus } from "@/types/couponType";
import { CONTENTS as CONTENTS_KEYS } from "@/utils/translationKeys";
import {
  COUPON_SEARCH_KEYS,
  COUPON_TABLE_COLUMNS,
  CouponSearchKey,
  SEARCH_FILTERS,
} from "@/utils/tableHeader";
import InfoTextCard from "@/components/UI/InfoTextCard";
import { useTranslation } from "react-i18next";
import {
  COUPON_ACTION_DELETE,
  COUPON_ACTION_EDIT,
  COUPON_ACTION_STATUS,
  CouponAction,
  SORT_DROPDOWN_VARIANT,
} from "@/utils/Constants";
import { SearchFilterWrap } from "../../Dashboard/ClientViewerBillings/styles";
import SearchBar from "@/components/UI/SearchBar";

type CouponTableProps = {
  data: CouponRow[];
  searchValue?: string;
  onActionSelect?: (action: CouponAction, row: CouponRow) => void;
  onRowClick?: (row: CouponRow) => void;
};

export default function CouponTable({
  data,
  searchValue,
  onActionSelect,
  onRowClick,
}: CouponTableProps) {
  const { t } = useTranslation();
  const [nameSortDirection, setNameSortDirection] =
    useState<SortDirectionWithNone>(SORT_DIRECTIONS.NONE);
  const [search, setSearch] = useState<Record<CouponSearchKey, string>>({
    [COUPON_SEARCH_KEYS.TITLE]: "",
    [COUPON_SEARCH_KEYS.CODES]: "",
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const resolveHeaderToKey = (header: string) => {
    const col = COUPON_TABLE_COLUMNS.find((c) => c.label === header);
    return col?.key as keyof CouponRow;
  };

  const filteredRows = useMemo(() => {
    const globalQuery = searchValue?.trim().toLowerCase() ?? "";
    const titleQuery = search.title.toLowerCase().trim();
    const codeQuery = search.codes.toLowerCase().trim();

    return data.filter((row) => {
      const matchGlobal =
        globalQuery.length < 2 || row.title.toLowerCase().includes(globalQuery);
      const matchTitle =
        !titleQuery || row.title.toLowerCase().includes(titleQuery);

      const matchCodes =
        !codeQuery ||
        row.codes.some((c) => c.toLowerCase().includes(codeQuery));

      return matchGlobal && matchTitle && matchCodes;
    });
  }, [data, search, searchValue]);

  const sortedRows = useMemo(() => {
    const base = filteredRows;
    if (nameSortDirection === SORT_DIRECTIONS.NONE) return base;
    return [...base].sort((a, b) => {
      const first = a.title.toLowerCase();
      const second = b.title.toLowerCase();
      return nameSortDirection === SORT_DIRECTIONS.ASC
        ? first.localeCompare(second)
        : second.localeCompare(first);
    });
  }, [filteredRows, nameSortDirection]);

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

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCopyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
  }, []);

  const handleSearchChange = (key: CouponSearchKey, value: string) => {
    setSearch((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <>
      <InfoTextCard
        title={t(CONTENTS_KEYS.couponsCard.title)}
        description={t(CONTENTS_KEYS.couponsCard.description)}
      />
      <TableSection>
        {data.length === 0 ? (
          <EmptyCollectionCard>
            <EmptyCollectionText>
              <EmptyCollectionTitle>
                {t("contents.emptyCoupon.title")}
              </EmptyCollectionTitle>
              <MonoText $use="Body_Medium">
                {t("contents.emptyCoupon.description")}
              </MonoText>
            </EmptyCollectionText>
          </EmptyCollectionCard>
        ) : (
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
            getMobileTitle={(row) => String(row.title)}
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
                      <CodeBadge key={code}>
                        {code}
                        <CopyButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyCode(code);
                          }}
                        >
                          {copiedCode === code ? (
                            <CheckIcon width={14} height={14} />
                          ) : (
                            <CopyIcon width={14} height={14} />
                          )}
                        </CopyButton>
                      </CodeBadge>
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
                  <ActionWrapper onClick={stopPropagation}>
                    <SortDropdown<CouponAction>
                      options={getCouponActionOptions(row.status)}
                      allowNoSelection
                      onChange={(action) => onActionSelect?.(action, row)}
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
            renderHeaderFilter={({ index }) => {
              const filter = SEARCH_FILTERS(t)?.[index];
              if (!filter) return null;

              return (
                <SearchFilterWrap>
                  <SearchBar
                    placeholder={filter.placeholder}
                    width="100%"
                    value={search[filter.key]}
                    onChange={(val: string) =>
                      handleSearchChange(filter.key, val)
                    }
                  />
                </SearchFilterWrap>
              );
            }}
            onRowClick={(row) => onRowClick?.(row)}
          />
        )}
      </TableSection>
    </>
  );
}
