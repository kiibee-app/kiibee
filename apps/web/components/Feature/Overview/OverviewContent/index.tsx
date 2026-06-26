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
  OVERVIEW_RANGES,
} from "@/utils/dummyData/overviewData";
import { renderContentIcon } from "@/utils/overviewContent";
import OverviewActivityChart from "./OverviewActivityChart";
import { CLICKS, NAME, PAGE_VISITS, VIEWS } from "@/utils/common";
import { useContentPerformance } from "@/hooks/overview/useContentPerformance";
import GenericLoader from "@/components/UI/GenericLoader";
import { LOADER_VARIANT } from "@/utils/ui";
import { useOverviewAnalytics } from "@/hooks/overview/useOverviewAnalytics";
import type { OverviewRange } from "@/types/overview";

export default function OverviewContent() {
  const { t } = useTranslation();
  const [range, setRange] = useState<OverviewRange>("Day");
  const {
    rows: contentPerformanceRows,
    isLoading: isContentPerformanceLoading,
  } = useContentPerformance();
  const {
    stats: overviewStats,
    chart: activityData,
    isLoading: isOverviewAnalyticsLoading,
  } = useOverviewAnalytics(range);
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
              {t(`dashboard.range.${r.key}`)}
            </RangeButton>
          ))}
        </RangeGroup>
      </TopRow>

      <CardsRow>
        {OVERVIEW_STATS.map((s) => (
          <StatCard key={s.id}>
            <StatRow>
              <StatDot $color={s.color} />
              <StatLabel>{t(s.labelKey)}</StatLabel>
            </StatRow>
            <StatValue>
              {overviewStats[s.id as keyof typeof overviewStats]}
            </StatValue>
          </StatCard>
        ))}
      </CardsRow>

      {isOverviewAnalyticsLoading ? (
        <GenericLoader
          variant={LOADER_VARIANT.INLINE}
          isOpen
          label={undefined}
        />
      ) : (
        <OverviewActivityChart data={activityData} />
      )}

      <PerformanceSection>
        <SectionTitle>{t("dashboard.contentPerformance")}</SectionTitle>
        <TableCard>
          {isContentPerformanceLoading ? (
            <GenericLoader
              variant={LOADER_VARIANT.INLINE}
              isOpen
              label={undefined}
            />
          ) : (
            <Table
              headers={[
                contentNameLabel,
                pageVisitsLabel,
                clicksLabel,
                viewsLabel,
              ]}
              data={contentPerformanceRows}
              rowsPerPage={contentPerformanceRows.length || 6}
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
          )}
        </TableCard>
      </PerformanceSection>
    </Wrapper>
  );
}
