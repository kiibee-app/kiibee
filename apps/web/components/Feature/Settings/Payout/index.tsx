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
import { CENTER_ALIGNED_HEADERS, parsePayoutBalance } from "@/utils/payout";
import { Settlement } from "../styles";
import { Directions, MODAL_ALIGN } from "@/utils/ui";
import { useSettlementHistory } from "@/hooks/useSettlementHistory";
import { usePayoutStats } from "@/hooks/usePayoutStats";
import { GenericModal } from "@/components/UI/Modals";
import { InfoIcon } from "@/assets/icons";

export default function PayoutContent() {
  const { t } = useTranslation();
  const [openDetails, setOpenDetails] = useState(false);
  const [openZeroBalance, setOpenZeroBalance] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SettlementRow | null>(null);

  const { stats } = usePayoutStats();
  const { settlements } = useSettlementHistory();

  const balanceValue = stats?.balance ?? "";
  const balanceAmount = parsePayoutBalance(balanceValue);
  const purchasesValue = stats?.purchases ?? 0;
  const rentalsValue = stats?.rentals ?? 0;

  const handlePayoutClick = () => {
    if (balanceAmount <= 0) {
      setOpenZeroBalance(true);
      return;
    }

    setOpenDetails(true);
  };

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

          <GenericButton variant={VARIANT.PRIMARY} onClick={handlePayoutClick}>
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

      <GenericModal
        visible={openZeroBalance}
        icon={<InfoIcon size={48} color={COLORS.primary.GREEN_200} />}
        iconMargin="0 auto 12px"
        textAlign={MODAL_ALIGN.CENTER}
        title={t("settings.payout.zeroBalanceModal.title")}
        message={t("settings.payout.zeroBalanceModal.message")}
        confirmLabel={t("settings.payout.zeroBalanceModal.done")}
        onClose={() => setOpenZeroBalance(false)}
        onConfirm={() => setOpenZeroBalance(false)}
        size="sm"
        spacing="xs"
        showCloseButton={false}
      />

      <PayoutDetailsModal
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        purchases={purchasesValue}
        rentals={rentalsValue}
      />

      <SettlementInvoiceModal
        open={!!selectedRow}
        row={selectedRow}
        onClose={() => setSelectedRow(null)}
      />
    </>
  );
}
