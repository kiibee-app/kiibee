"use client";

import React from "react";
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

type StatItem = {
  label: string;
  value: string | number;
};

export default function PayoutContent() {
  const { t } = useTranslation();

  const stats: StatItem[] = [
    { label: "Balance", value: "14.51 kr." },
    { label: "Purchase", value: 94 },
    { label: "Rent", value: 39 },
  ];

  const [balance, ...restStats] = stats;

  return (
    <Card>
      <CardTop>
        <TextBlock>
          <MonoText $use="Body_SemiBold">
            {t("payout.title", "Payout")}
          </MonoText>

          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
            {t(
              "payout.description",
              "When you click the button, a statement is created that you can pay out, click on pay out to see your credit note.",
            )}
          </MonoText>
        </TextBlock>

        <GenericButton variant="primary">
          {t("payout.button", "Payout")}
        </GenericButton>
      </CardTop>

      <Stats>
        <BalanceCard>
          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
            {t("payout.balance", balance.label)}
          </MonoText>
          <MonoText $use="H4_SemiBold">{balance.value}</MonoText>
        </BalanceCard>

        <SmallCards>
          {restStats.map((item) => (
            <SmallCard key={item.label}>
              <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
                {item.label}
              </MonoText>
              <MonoText $use="H4_SemiBold">{item.value}</MonoText>
            </SmallCard>
          ))}
        </SmallCards>
      </Stats>
    </Card>
  );
}
