"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "@/components/UI/Table";
import { MonoText } from "@/components/UI/Monotext";
import { DeleteIcon } from "@/assets/icons";
import { GenericModal } from "@/components/UI/Modals";
import GenericLoader from "@/components/UI/GenericLoader";
import { DASHBOARD_USERS } from "@/utils/translationKeys";
import { RegistrationRow } from "@/types/creatorUsers";
import {
  buildHeaderMap,
  REGISTRATION_TABLE_HEADER_KEYS,
} from "@/utils/tableHeader";
import { useSortOrder } from "@/hooks/useSortOrder";
import { LOADER_VARIANT } from "@/utils/ui";
import { filterUsersByName } from "@/utils/filterUsersByName";
import {
  useDeleteRegistration,
  useRegistrations,
} from "@/hooks/users/useCreatorUsers";
import UsersEmptyState from "../EmptyState";
import COLORS from "@repo/ui/colors";
import {
  DeleteActionButton,
  EmptySectionDescription,
  EmptySectionHeader,
  EmptySectionTitle,
  SectionCard,
  SectionDescription,
  SectionTitle,
  TableSection,
} from "./styles";

type RegistrationsTabContentProps = {
  searchValue: string;
};

export default function RegistrationsTabContent({
  searchValue,
}: RegistrationsTabContentProps) {
  const { t } = useTranslation();
  const { rows, isLoading } = useRegistrations();
  const { deleteRegistration } = useDeleteRegistration();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteModalKeys = DASHBOARD_USERS.registrations.deleteModal;
  const headers = REGISTRATION_TABLE_HEADER_KEYS.map((headerKey) =>
    t(DASHBOARD_USERS.registrations.tableHeaders[headerKey]),
  );
  const headerMap = buildHeaderMap<keyof RegistrationRow>(
    headers,
    REGISTRATION_TABLE_HEADER_KEYS,
  );

  const rowToDelete = useMemo(
    () => rows.find((item) => item.id === selectedId) ?? null,
    [rows, selectedId],
  );

  const filteredRows = useMemo(() => {
    return filterUsersByName(rows, searchValue);
  }, [rows, searchValue]);

  const {
    sortedData: sortedRows,
    isHeaderSortable,
    getHeaderSortDirection,
    handleHeaderClick,
  } = useSortOrder(filteredRows, {
    targetHeader: headers[0],
    sortBy: (item) => item.name,
  });

  const handleDeleteConfirm = async () => {
    if (!rowToDelete) return;

    setIsDeleting(true);
    try {
      await deleteRegistration(rowToDelete.id);
      setSelectedId(null);
    } finally {
      setIsDeleting(false);
    }
  };

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
            {t(DASHBOARD_USERS.registrations.title)}
          </EmptySectionTitle>
          <EmptySectionDescription>
            {t(DASHBOARD_USERS.registrations.description)}
          </EmptySectionDescription>
        </EmptySectionHeader>

        <UsersEmptyState
          title={t(DASHBOARD_USERS.registrations.emptyState.title)}
          description={t(DASHBOARD_USERS.registrations.emptyState.description)}
        />
      </>
    );
  }

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
          data={sortedRows}
          rowsPerPage={10}
          headerToKey={(header) => headerMap[header]}
          onHeaderClick={handleHeaderClick}
          isHeaderSortable={isHeaderSortable}
          getHeaderSortDirection={getHeaderSortDirection}
          getRowKey={(row) => row.id}
          getMobileTitle={(row) => row.name}
          renderCell={({ header, row }) => {
            if (header === headers[3]) {
              return (
                <DeleteActionButton
                  type="button"
                  aria-label={t(
                    DASHBOARD_USERS.registrations.deleteModal.delete,
                  )}
                  onClick={() => setSelectedId(row.id)}
                >
                  <DeleteIcon />
                </DeleteActionButton>
              );
            }

            const key = headerMap[header];
            if (key === "action" || key === "id" || !key) return null;

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

      <GenericModal
        visible={Boolean(selectedId)}
        title={t(deleteModalKeys.title)}
        message={t(deleteModalKeys.message)}
        cancelLabel={t(deleteModalKeys.cancel)}
        confirmLabel={t(deleteModalKeys.delete)}
        onCancel={() => setSelectedId(null)}
        onClose={() => setSelectedId(null)}
        onConfirm={handleDeleteConfirm}
        width="560px"
        padding="36px 40px"
        buttonRow
        showCloseButton={false}
        confirmLoading={isDeleting}
      />
    </>
  );
}
