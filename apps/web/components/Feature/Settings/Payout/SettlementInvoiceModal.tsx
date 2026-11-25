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
        {props.row.feeCalculationError && (
          <p role="alert">{props.row.feeCalculationError}</p>
        )}
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

          {props.row.grossAmount && (
            <>
              <InvoiceInfo>
                <InvoiceLabel>
                  {t("settings.payout.modal.grossAmount", "Gross sales")}
                </InvoiceLabel>
                <MonoText $use="Body_SemiBold">
                  {props.row.grossAmount}
                </MonoText>
              </InvoiceInfo>
              {props.row.saleCount != null && (
                <InvoiceInfo>
                  <InvoiceLabel>
                    {t("settings.payout.modal.totalSales", "Total Sales")}
                  </InvoiceLabel>
                  <MonoText $use="Body_SemiBold">
                    {props.row.saleCount}
                  </MonoText>
                </InvoiceInfo>
              )}
              {props.row.platformFee && !props.row.feeCalculationError && (
                <InvoiceInfo>
                  <InvoiceLabel>
                    {props.row.fixedPlatformFee != null
                      ? t("settings.payout.modal.fixedPlatformFee", {
                          count: props.row.saleCount,
                          fee: props.row.fixedPlatformFee,
                        })
                      : t("settings.payout.modal.kiibeeFee", "Kiibee fee")}
                  </InvoiceLabel>
                  <MonoText $use="Body_SemiBold">
                    −{props.row.platformFee}
                  </MonoText>
                </InvoiceInfo>
              )}
              {props.row.processingFee && !props.row.feeCalculationError && (
                <InvoiceInfo>
                  <InvoiceLabel>
                    {t("settings.payout.modal.acquirerFee", "Acquirer fee")}{" "}
                    {props.row.processingFeePercentage != null
                      ? `(${props.row.processingFeePercentage * 100}%)`
                      : ""}
                  </InvoiceLabel>
                  <MonoText $use="Body_SemiBold">
                    −{props.row.processingFee}
                  </MonoText>
                </InvoiceInfo>
              )}
            </>
          )}
          <InvoiceInfo>
            <InvoiceLabel>
              {t("settings.payout.tableHeaders.bank")}
            </InvoiceLabel>
            <InvoicePaymentMethod>
              <MonoText $use="Body_SemiBold">{props.row.bank}</MonoText>
            </InvoicePaymentMethod>
          </InvoiceInfo>
          {props.row.bankDetails &&
            [
              [
                t("settings.payout.bankDetails.bankName"),
                props.row.bankDetails.bankName,
              ],
              [
                t("settings.payout.bankDetails.accountHolderName"),
                props.row.bankDetails.accountHolderName,
              ],
              [
                t("settings.payout.bankDetails.registrationNumber"),
                props.row.bankDetails.registrationNumber,
              ],
              [
                t("settings.payout.bankDetails.accountNumber"),
                props.row.bankDetails.accountNumber,
              ],
            ].map(([label, value]) => (
              <InvoiceInfo key={label}>
                <InvoiceLabel>{label}</InvoiceLabel>
                <MonoText $use="Body_SemiBold">{value || "—"}</MonoText>
              </InvoiceInfo>
            ))}
        </InvoiceGrid>
      </InvoiceCard>
    </GenericModal>
  );
}
