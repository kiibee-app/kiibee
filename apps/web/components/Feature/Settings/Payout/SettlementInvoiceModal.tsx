"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import { MonoText } from "@/components/UI/Monotext";
import { MODAL_ALIGN } from "@/utils/ui";
import { DASHBOARD_VIEWER_BILLINGS } from "@/utils/translationKeys";
import { SettlementRow } from "@/types/tableContract";
import {
  InvoiceCard,
  InvoiceGrid,
  InvoiceInfo,
  InvoiceLabel,
  InvoicePaymentMethod,
} from "./styles";

export type Props = {
  open: boolean;
  row: SettlementRow | null;
  onClose: () => void;
};

export default function SettlementInvoiceModal(props: Props) {
  const { t } = useTranslation();

  if (!props.row) return null;

  return (
    <GenericModal
      visible={props.open}
      title={t(DASHBOARD_VIEWER_BILLINGS.billingHistory.invoiceModal.title)}
      onClose={props.onClose}
      size="md"
      spacing="start"
      textAlign={MODAL_ALIGN.START}
      contentMarginBottom="0"
    >
      <InvoiceCard>
        <InvoiceGrid>
          <InvoiceInfo>
            <InvoiceLabel>
              {t("settings.payout.tableHeaders.creditNo")}
            </InvoiceLabel>
            <MonoText $use="Body_SemiBold">{props.row.creditNo}</MonoText>
          </InvoiceInfo>

          <InvoiceInfo>
            <InvoiceLabel>
              {t("settings.payout.tableHeaders.status")}
            </InvoiceLabel>
            <MonoText $use="Body_SemiBold">{props.row.status}</MonoText>
          </InvoiceInfo>

          <InvoiceInfo>
            <InvoiceLabel>
              {t("settings.payout.tableHeaders.date")}
            </InvoiceLabel>
            <MonoText $use="Body_SemiBold">{props.row.date}</MonoText>
          </InvoiceInfo>

          <InvoiceInfo>
            <InvoiceLabel>
              {t("settings.payout.tableHeaders.amount")}
            </InvoiceLabel>
            <MonoText $use="Body_SemiBold">{props.row.amount}</MonoText>
          </InvoiceInfo>

          <InvoiceInfo>
            <InvoiceLabel>
              {t("settings.payout.tableHeaders.bank")}
            </InvoiceLabel>
            <InvoicePaymentMethod>
              <MonoText $use="Body_SemiBold">{props.row.bank}</MonoText>
            </InvoicePaymentMethod>
          </InvoiceInfo>
        </InvoiceGrid>
      </InvoiceCard>
    </GenericModal>
  );
}
