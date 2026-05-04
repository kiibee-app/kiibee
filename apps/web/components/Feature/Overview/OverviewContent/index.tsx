"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "@/components/UI/Table";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { TABLE_ALIGN } from "@/utils/ui";
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
  PerformanceSection,
  SectionTitle,
  TableCard,
  ContentMeta,
  ContentIcon,
  ContentLabel,
} from "./styles";
import OVERVIEW_STATS, {
  OVERVIEW_ACTIVITY_DATA,
  OVERVIEW_CONTENT_PERFORMANCE,
  OVERVIEW_RANGES,
  type OverviewRange,
} from "@/utils/dummyData/overviewData";
import { renderContentIcon } from "@/utils/overviewContent";
import OverviewActivityChart from "./OverviewActivityChart";
import { CLICKS, NAME, PAGE_VISITS, VIEWS } from "@/utils/common";

export default function OverviewContent() {
  const { t } = useTranslation();
  const [range, setRange] = useState<OverviewRange>("Day");
  const activityData = OVERVIEW_ACTIVITY_DATA[range];
  const contentNameLabel = t("dashboard.contentName");
  const pageVisitsLabel = t("dashboard.pageVisits");
  const clicksLabel = t("dashboard.clicks");
  const viewsLabel = t("dashboard.views");

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

      <OverviewActivityChart data={activityData} />

      <PerformanceSection>
        <SectionTitle>{t("dashboard.contentPerformance")}</SectionTitle>
        <TableCard>
          <Table
            headers={[
              contentNameLabel,
              pageVisitsLabel,
              clicksLabel,
              viewsLabel,
            ]}
            data={OVERVIEW_CONTENT_PERFORMANCE}
            rowsPerPage={OVERVIEW_CONTENT_PERFORMANCE.length}
            getRowKey={(row) => row.id}
            headerToKey={(header) => {
              if (header === contentNameLabel) return NAME;
              if (header === pageVisitsLabel) return PAGE_VISITS;
              if (header === clicksLabel) return CLICKS;
              return VIEWS;
            }}
            getColumnAlignment={(_header, index) =>
              index === 0 ? TABLE_ALIGN.LEFT : TABLE_ALIGN.CENTER
            }
            getMobileTitle={(row) => row.name}
            renderCell={({ header, row }) => {
              if (header === contentNameLabel) {
                return (
                  <ContentMeta>
                    <ContentIcon>{renderContentIcon(row.icon)}</ContentIcon>
                    <ContentLabel>{row.name}</ContentLabel>
                  </ContentMeta>
                );
              }

              const value =
                header === pageVisitsLabel
                  ? row.pageVisits
                  : header === clicksLabel
                    ? row.clicks
                    : row.views;

              return (
                <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_700}>
                  {value}
                </MonoText>
              );
            }}
          />
        </TableCard>
      </PerformanceSection>
    </Wrapper>
  );
}
