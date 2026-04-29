"use client";

import { useTranslation } from "react-i18next";
import Table from "@/components/UI/Table";
import { MonoText } from "@/components/UI/Monotext";
import { DASHBOARD_USERS } from "@/utils/translationKeys";
import COLORS from "@repo/ui/colors";
import { SalesRow, salesData } from "@/utils/dummyData/users";
import { buildHeaderMap, SALES_TABLE_HEADER_KEYS } from "@/utils/tableHeader";
import {
  SectionCard,
  SectionDescription,
  SectionTitle,
  TableSection,
} from "./styles";

export default function SalestTabContent() {
  const { t } = useTranslation();
  const headers = SALES_TABLE_HEADER_KEYS.map((headerKey) =>
    t(DASHBOARD_USERS.salest.tableHeaders[headerKey]),
  );
  const headerMap = buildHeaderMap<keyof SalesRow>(
    headers,
    SALES_TABLE_HEADER_KEYS,
  );

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
          data={salesData}
          rowsPerPage={10}
          headerToKey={(header) => headerMap[header]}
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
