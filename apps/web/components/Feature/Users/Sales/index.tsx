"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Table from "@/components/UI/Table";
import { MonoText } from "@/components/UI/Monotext";
import { DASHBOARD_USERS } from "@/utils/translationKeys";
import COLORS from "@repo/ui/colors";
import { SalesRow, salesData } from "@/utils/dummyData/users";
import { buildHeaderMap, SALES_TABLE_HEADER_KEYS } from "@/utils/tableHeader";
import { useSortOrder } from "@/hooks/useSortOrder";
import { filterUsersByName } from "@/utils/filterUsersByName";
import {
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
  const headers = SALES_TABLE_HEADER_KEYS.map((headerKey) =>
    t(DASHBOARD_USERS.salest.tableHeaders[headerKey]),
  );
  const headerMap = buildHeaderMap<keyof SalesRow>(
    headers,
    SALES_TABLE_HEADER_KEYS,
  );
  const filteredSalesData = useMemo(() => {
    return filterUsersByName(salesData, searchValue);
  }, [searchValue]);

  const {
    sortedData: sortedSalesData,
    isHeaderSortable,
    getHeaderSortDirection,
    handleHeaderClick,
  } = useSortOrder(filteredSalesData, {
    targetHeader: headers[0],
    sortBy: (item) => item.name,
  });

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
          onHeaderClick={handleHeaderClick}
          isHeaderSortable={isHeaderSortable}
          getHeaderSortDirection={getHeaderSortDirection}
          getRowKey={(row, index) => `${row.email}-${index}`}
          getMobileTitle={(row) => row.name}
          renderCell={({ header, row }) => (
            <MonoText
              $use="Body_SemiBold"
              color={
                header === headers[0]
                  ? COLORS.primary.BLACK
                  : COLORS.neutral.GRAY
              }
            >
              {row[headerMap[header]]}
            </MonoText>
          )}
        />
      </TableSection>
    </>
  );
}
