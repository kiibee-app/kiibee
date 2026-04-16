"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Wrapper,
  TopRow,
  Title,
  RangeGroup,
  RangeButton,
  CardsRow,
  StatCard,
  StatLabel,
  StatValue,
  StatDot,
  StatRow,
} from "./styles";
import OVERVIEW_STATS, {
  OVERVIEW_RANGES,
} from "@/utils/dummyData/overviewData";

export default function OverviewContent() {
  const { t } = useTranslation();
  const [range, setRange] = useState<string>("Day");

  return (
    <Wrapper>
      <Title>{t("dashboard.overview")}</Title>
      <TopRow>
        <div />
        <RangeGroup>
          {OVERVIEW_RANGES.map((r) => (
            <RangeButton
              key={r.key}
              $active={range === r.key}
              onClick={() => setRange(r.key)}
            >
              {r.key}
            </RangeButton>
          ))}
        </RangeGroup>
      </TopRow>

      <CardsRow>
        {OVERVIEW_STATS.map((s) => (
          <StatCard key={s.id}>
            <StatRow>
              <StatDot $color={s.color} />
              <StatLabel>{s.label}</StatLabel>
            </StatRow>
            <StatValue>{s.value}</StatValue>
          </StatCard>
        ))}
      </CardsRow>
    </Wrapper>
  );
}
