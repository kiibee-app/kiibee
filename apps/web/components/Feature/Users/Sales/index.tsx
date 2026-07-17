"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "@/components/UI/Table";
import Pagination from "@/components/UI/Table/TablePagination";
import { MonoText } from "@/components/UI/Monotext";
import GenericLoader from "@/components/UI/GenericLoader";
import { DASHBOARD_USERS } from "@/utils/translationKeys";
import COLORS from "@repo/ui/colors";
import { SalesRow } from "@/types/creatorUsers";
import { buildHeaderMap, SALES_TABLE_HEADER_KEYS } from "@/utils/tableHeader";
import { useTableSort } from "@/hooks/useTableSort";
import { LOADER_VARIANT } from "@/utils/ui";
import { getPaginationItems } from "@/utils/pagination";
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
  page: number;
  onPageChange: (page: number) => void;
};

const DEFAULT_SALES_LIMIT = 10;

export default function SalesTabContent({
  searchValue,
  page,
  onPageChange,
}: SalestTabContentProps) {
  const { t } = useTranslation();
  const [limit, setLimit] = useState(DEFAULT_SALES_LIMIT);
  const search = searchValue.trim();
  const { rows, isLoading, pagination } = useSales({
    search: search || undefined,
    page,
    limit,
  });

  const headers = SALES_TABLE_HEADER_KEYS.map((headerKey) =>
    t(DASHBOARD_USERS.salest.tableHeaders[headerKey]),
  );
  const headerMap = buildHeaderMap<keyof SalesRow>(
    headers,
    SALES_TABLE_HEADER_KEYS,
  );

  const {
    sortedData: sortedSalesData,
    isHeaderSortable,
    getHeaderSortDirection,
    toggleSort,
  } = useTableSort(rows, {
    sortableHeader: headers[0],
    sortBy: (item) => item.name,
  });

  const paginationItems = getPaginationItems(
    pagination?.page ?? page,
    pagination?.totalPages ?? 1,
  );

  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setLimit(rowsPerPage);
    onPageChange(1);
  };

  if (isLoading) {
    return (
      <GenericLoader variant={LOADER_VARIANT.INLINE} isOpen label={undefined} />
    );
  }

  if (rows.length === 0 && !search) {
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
          hidePagination
          headerToKey={(header) => headerMap[header]}
          onHeaderClick={toggleSort}
          isHeaderSortable={isHeaderSortable}
          getHeaderSortDirection={getHeaderSortDirection}
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

        {pagination && pagination.totalItems > DEFAULT_SALES_LIMIT && (
          <Pagination
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            currentPage={pagination.page}
            paginationItems={paginationItems}
            rowsPerPage={pagination.limit}
            onRowsPerPageChange={handleRowsPerPageChange}
            onChange={onPageChange}
          />
        )}
      </TableSection>
    </>
  );
}
