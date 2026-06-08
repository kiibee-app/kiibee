"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "@/components/UI/Table";
import { MonoText } from "@/components/UI/Monotext";
import GenericLoader from "@/components/UI/GenericLoader";
import { DASHBOARD_USERS } from "@/utils/translationKeys";
import COLORS from "@repo/ui/colors";
import { SalesRow } from "@/types/creatorUsers";
import { buildHeaderMap, SALES_TABLE_HEADER_KEYS } from "@/utils/tableHeader";
import {
  SORT_DIRECTIONS,
  SortDirectionWithNone,
  LOADER_VARIANT,
} from "@/utils/ui";
import { filterUsersByName } from "@/utils/filterUsersByName";
import { useSales } from "@/hooks/users/useCreatorUsers";
import UsersEmptyState from "../EmptyState";
import {
  EmptySectionDescription,
  EmptySectionHeader,
  EmptySectionTitle,
  SectionCard,
  SectionDescription,
  SectionTitle,
  TableSection,
} from "./styles";

type SalestTabContentProps = {
  searchValue: string;
};

export default function SalesTabContent({
  searchValue,
}: SalestTabContentProps) {
  const { t } = useTranslation();
  const { rows, isLoading } = useSales();
  const [nameSortDirection, setNameSortDirection] =
    useState<SortDirectionWithNone>(SORT_DIRECTIONS.NONE);
  const headers = SALES_TABLE_HEADER_KEYS.map((headerKey) =>
    t(DASHBOARD_USERS.salest.tableHeaders[headerKey]),
  );
  const headerMap = buildHeaderMap<keyof SalesRow>(
    headers,
    SALES_TABLE_HEADER_KEYS,
  );
  const sortedSalesData = useMemo(() => {
    const filtered = filterUsersByName(rows, searchValue);
    return [...filtered].sort((a, b) => {
      const compared = a.name.localeCompare(b.name, undefined, {
        sensitivity: "base",
      });
      return nameSortDirection === SORT_DIRECTIONS.DESC ? -compared : compared;
    });
  }, [rows, searchValue, nameSortDirection]);

  if (isLoading) {
    return (
      <GenericLoader variant={LOADER_VARIANT.INLINE} isOpen label={undefined} />
    );
  }

  if (rows.length === 0) {
    return (
      <>
        <EmptySectionHeader>
          <EmptySectionTitle>
            {t(DASHBOARD_USERS.salest.title)}
          </EmptySectionTitle>
          <EmptySectionDescription>
            {t(DASHBOARD_USERS.salest.description)}
          </EmptySectionDescription>
        </EmptySectionHeader>

        <UsersEmptyState
          title={t(DASHBOARD_USERS.salest.emptyState.title)}
          description={t(DASHBOARD_USERS.salest.emptyState.description)}
        />
      </>
    );
  }

  return (
    <>
      <SectionCard>
        <SectionTitle>{t(DASHBOARD_USERS.salest.title)}</SectionTitle>
        <SectionDescription>
          {t(DASHBOARD_USERS.salest.description)}
        </SectionDescription>
      </SectionCard>

      <TableSection>
        <Table<SalesRow>
          headers={headers}
          data={sortedSalesData}
          rowsPerPage={10}
          headerToKey={(header) => headerMap[header]}
          onHeaderClick={(header) => {
            if (header !== headers[0]) return;
            setNameSortDirection((prev) => {
              if (prev === SORT_DIRECTIONS.NONE) return SORT_DIRECTIONS.ASC;
              if (prev === SORT_DIRECTIONS.ASC) return SORT_DIRECTIONS.DESC;
              return SORT_DIRECTIONS.NONE;
            });
          }}
          isHeaderSortable={(header) => header === headers[0]}
          getHeaderSortDirection={(header) =>
            header === headers[0] && nameSortDirection !== SORT_DIRECTIONS.NONE
              ? nameSortDirection
              : null
          }
          getRowKey={(row) => row.id}
          getMobileTitle={(row) => row.name}
          renderCell={({ header, row }) => {
            const key = headerMap[header];
            if (key === "id") return null;

            return (
              <MonoText
                $use="Body_SemiBold"
                color={
                  header === headers[0]
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
