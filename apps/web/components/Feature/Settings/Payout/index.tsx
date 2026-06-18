"use client";

import React, { useState } from "react";
import { MonoText } from "@/components/UI/Monotext";
import { useTranslation } from "react-i18next";
import {
  BalanceCard,
  Card,
  CardTop,
  SmallCard,
  SmallCards,
  Stats,
  TextBlock,
} from "./styles";
import COLORS from "@repo/ui/colors";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import PayoutDetailsModal from "./PayoutDetailsModal";
import SettlementInvoiceModal from "./SettlementInvoiceModal";
import Table from "@/components/UI/Table";
import { SettlementRow } from "@/types/tableContract";
import { settlementHeaders } from "@/utils/dummyData/payout";
import { CENTER_ALIGNED_HEADERS } from "@/utils/payout";
import { Settlement } from "../styles";
import { Directions, MODAL_ALIGN } from "@/utils/ui";
import { useSettlementHistory } from "@/hooks/useSettlementHistory";
import { usePayoutStats } from "@/hooks/usePayoutStats";

export default function PayoutContent() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SettlementRow | null>(null);

  const { stats } = usePayoutStats();
  const { settlements } = useSettlementHistory();

  const balanceValue = stats?.balance ?? "";
  const purchasesValue = stats?.purchases ?? 0;
  const rentalsValue = stats?.rentals ?? 0;

  return (
    <>
      <Card>
        <CardTop>
          <TextBlock>
            <MonoText $use="Body_SemiBold">
              {t("settings.payout.title")}
            </MonoText>

            <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
              {t("settings.payout.description")}
            </MonoText>
          </TextBlock>

          <GenericButton
            variant={VARIANT.PRIMARY}
            onClick={() => setOpen(true)}
          >
            {t("settings.payout.title")}
          </GenericButton>
        </CardTop>

        <Stats>
          <BalanceCard>
            <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
              {t("settings.payout.balance")}
            </MonoText>

            <MonoText $use="H4_SemiBold">{balanceValue}</MonoText>
          </BalanceCard>

          <SmallCards>
            <SmallCard>
              <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
                {t("settings.payout.purchase")}
              </MonoText>

              <MonoText $use="H4_SemiBold">{purchasesValue}</MonoText>
            </SmallCard>
            <SmallCard>
              <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
                {t("settings.payout.rent")}
              </MonoText>

              <MonoText $use="H4_SemiBold">{rentalsValue}</MonoText>
            </SmallCard>
          </SmallCards>
        </Stats>
      </Card>
      <Settlement>
        <MonoText $use="H4_Medium">
          {t("settings.payout.settlementHistory")}
        </MonoText>
        <Table<SettlementRow>
          headers={settlementHeaders}
          data={settlements}
          rowsPerPage={10}
          getColumnAlignment={(header, index) =>
            index === 0 || !CENTER_ALIGNED_HEADERS.includes(header)
              ? Directions.LEFT
              : MODAL_ALIGN.CENTER
          }
          headerToKey={(h) => {
            const map: Record<string, keyof SettlementRow> = {
              Amount: "amount",
              Status: "status",
              "Credit No": "creditNo",
              Bank: "bank",
              Date: "date",
            };
            return map[h];
          }}
          getRowKey={(row, index) => `${row.creditNo}-${index}`}
          getMobileTitle={(row) => row.amount}
          onRowClick={(row) => {
            setSelectedRow(row);
          }}
        />
      </Settlement>

      <PayoutDetailsModal open={open} onClose={() => setOpen(false)} />

      <SettlementInvoiceModal
        open={!!selectedRow}
        row={selectedRow}
        onClose={() => setSelectedRow(null)}
      />
    </>
  );
}
