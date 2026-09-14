"use client";

import React, { useMemo } from "react";
import ClientViewerBillings from "@/components/Feature/Dashboard/ClientViewerBillings";
import { useCreatorPaymentMethods } from "@/hooks/useCreatorPaymentMethods";
import { useCreatorProfile } from "@/hooks/auth/useCreatorProfile";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import Table from "@/components/UI/Table";
import { Settlement, Subtitle } from "./styles";
import { Directions, MODAL_ALIGN } from "@/utils/ui";
import { toCamelCaseKey } from "@/utils/common";
import COLORS from "@repo/ui/colors";

type CreatorPaymentRow = {
  reg: string;
  account: string;
  accountHolderName: string;
  bankName: string;
};

export default function PayoutMethodsContent() {
  const { t } = useTranslation();
  const creatorPaymentMethods = useCreatorPaymentMethods();
  const { form } = useCreatorProfile();

  const tableHeaders = useMemo(
    () => [
      t("settings.payoutMethods.regLabel"),
      t("settings.payoutMethods.accountLabel"),
      t("creatorProfile.accountHolderNameLabel"),
      t("creatorProfile.bankNameLabel"),
    ],
    [t],
  );

  const paymentData: CreatorPaymentRow[] = useMemo(
    () => [
      {
        reg: form.reg || "",
        account: form.account || "",
        accountHolderName: form.accountHolderName || "",
        bankName: form.bankName || "",
      },
    ],
    [form.account, form.accountHolderName, form.bankName, form.reg],
  );

  const showAddCardSection = false;

  return (
    <>
      <Settlement>
        <div>
          <MonoText $use="H4_Medium">
            {t("settings.payoutMethods.title")}
          </MonoText>
          <Subtitle $use="Body_Medium" color={COLORS.neutral.GRAY}>
            {t("settings.payoutMethods.subtitle")}
          </Subtitle>
        </div>

        <Table<CreatorPaymentRow>
          headers={tableHeaders}
          data={paymentData}
          rowsPerPage={10}
          hidePagination
          getColumnAlignment={(_, index) =>
            index === 0 ? Directions.LEFT : MODAL_ALIGN.CENTER
          }
          headerToKey={(h) => {
            const map: Record<string, keyof CreatorPaymentRow> = {
              [t("settings.payoutMethods.regLabel")]: "reg",
              [t("settings.payoutMethods.accountLabel")]: "account",
              [t("creatorProfile.accountHolderNameLabel")]: "accountHolderName",
              [t("creatorProfile.bankNameLabel")]: "bankName",
            };
            return map[h] ?? (toCamelCaseKey(h) as keyof CreatorPaymentRow);
          }}
          getRowKey={(row, index) => `${row.reg}-${index}`}
        />
      </Settlement>

      {showAddCardSection && (
        <ClientViewerBillings
          onlyPaymentMethods
          creatorPaymentMethods={creatorPaymentMethods}
        />
      )}
    </>
  );
}
