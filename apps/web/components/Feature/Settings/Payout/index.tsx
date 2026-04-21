"use client";

import React, { useMemo } from "react";
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

type StatItem = {
  label: string;
  value: string | number;
};

export default function PayoutContent() {
  const { t } = useTranslation();

  const stats: StatItem[] = useMemo(
    () => [
      { label: "Balance", value: "14.51 kr." },
      { label: "Purchase", value: 94 },
      { label: "Rent", value: 39 },
    ],
    [],
  );

  const balance = stats[0];
  const restStats = stats.slice(1);

  return (
    <Card>
      <CardTop>
        <TextBlock>
          <MonoText $use="Body_SemiBold">{t("payout.title")}</MonoText>

          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
            {t("payout.description")}
          </MonoText>
        </TextBlock>

        <GenericButton variant={VARIANT.PRIMARY}>
          {t("payout.title")}
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
