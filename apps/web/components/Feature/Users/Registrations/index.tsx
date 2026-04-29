"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "@/components/UI/Table";
import { MonoText } from "@/components/UI/Monotext";
import { DeleteIcon } from "@/assets/icons";
import { GenericModal } from "@/components/UI/Modals";
import { DASHBOARD_USERS } from "@/utils/translationKeys";
import { RegistrationRow, registrationData } from "@/utils/dummyData/users";
import {
  buildHeaderMap,
  REGISTRATION_TABLE_HEADER_KEYS,
} from "@/utils/tableHeader";
import COLORS from "@repo/ui/colors";
import {
  DeleteActionButton,
  SectionCard,
  SectionDescription,
  SectionTitle,
  TableSection,
} from "./styles";

export default function RegistrationsTabContent() {
  const { t } = useTranslation();
  const [rows, setRows] = useState<RegistrationRow[]>(registrationData);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const deleteModalKeys = DASHBOARD_USERS.registrations.deleteModal;
  const headers = REGISTRATION_TABLE_HEADER_KEYS.map((headerKey) =>
    t(DASHBOARD_USERS.registrations.tableHeaders[headerKey]),
  );
  const headerMap = buildHeaderMap<keyof RegistrationRow>(
    headers,
    REGISTRATION_TABLE_HEADER_KEYS,
  );

  const rowToDelete = useMemo(
    () => rows.find((item) => item.email === selectedEmail) ?? null,
    [rows, selectedEmail],
  );

  return (
    <>
      <SectionCard>
        <SectionTitle>{t(DASHBOARD_USERS.registrations.title)}</SectionTitle>
        <SectionDescription>
          {t(DASHBOARD_USERS.registrations.description)}
        </SectionDescription>
      </SectionCard>

      <TableSection>
        <Table<RegistrationRow>
          headers={headers}
          data={rows}
          rowsPerPage={10}
          headerToKey={(header) => headerMap[header]}
          getRowKey={(row, index) => `${row.email}-${index}`}
          getMobileTitle={(row) => row.name}
          renderCell={({ header, row }) => {
            if (header === headers[3]) {
              return (
                <DeleteActionButton
                  type="button"
                  aria-label={t(
                    DASHBOARD_USERS.registrations.deleteModal.delete,
                  )}
                  onClick={() => setSelectedEmail(row.email)}
                >
                  <DeleteIcon />
                </DeleteActionButton>
              );
            }

            return (
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
            );
          }}
        />
      </TableSection>

      <GenericModal
        visible={Boolean(selectedEmail)}
        title={t(deleteModalKeys.title)}
        message={t(deleteModalKeys.message)}
        cancelLabel={t(deleteModalKeys.cancel)}
        confirmLabel={t(deleteModalKeys.delete)}
        onCancel={() => setSelectedEmail(null)}
        onClose={() => setSelectedEmail(null)}
        onConfirm={() => {
          if (!rowToDelete) return;
          setRows((prev) =>
            prev.filter((item) => item.email !== rowToDelete.email),
          );
          setSelectedEmail(null);
        }}
        width="560px"
        padding="36px 40px"
        buttonRow
        showCloseButton={false}
      />
    </>
  );
}
