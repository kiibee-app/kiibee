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

type Props = {
  open: boolean;
  row: SettlementRow | null;
  onClose: () => void;
};

export default function SettlementInvoiceModal({ open, row, onClose }: Props) {
  const { t } = useTranslation();

  if (!row) return null;

  return (
    <GenericModal
      visible={open}
      title={t(DASHBOARD_VIEWER_BILLINGS.billingHistory.invoiceModal.title)}
      onClose={onClose}
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
            <MonoText $use="Body_SemiBold">{row.creditNo}</MonoText>
          </InvoiceInfo>

          <InvoiceInfo>
            <InvoiceLabel>
              {t("settings.payout.tableHeaders.status")}
            </InvoiceLabel>
            <MonoText $use="Body_SemiBold">{row.status}</MonoText>
          </InvoiceInfo>

          <InvoiceInfo>
            <InvoiceLabel>
              {t("settings.payout.tableHeaders.date")}
            </InvoiceLabel>
            <MonoText $use="Body_SemiBold">{row.date}</MonoText>
          </InvoiceInfo>

          <InvoiceInfo>
            <InvoiceLabel>
              {t("settings.payout.tableHeaders.amount")}
            </InvoiceLabel>
            <MonoText $use="Body_SemiBold">{row.amount}</MonoText>
          </InvoiceInfo>

          <InvoiceInfo>
            <InvoiceLabel>
              {t("settings.payout.tableHeaders.bank")}
            </InvoiceLabel>
            <InvoicePaymentMethod>
              <MonoText $use="Body_SemiBold">{row.bank}</MonoText>
            </InvoicePaymentMethod>
          </InvoiceInfo>
        </InvoiceGrid>
      </InvoiceCard>
    </GenericModal>
  );
}
