"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { LeftIcon } from "@/assets/icons";
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
  TableScroll,
  PerformanceTable,
  TableHeadCell,
  TableNameCell,
  TableBodyCell,
  ContentMeta,
  ContentIcon,
  ContentLabel,
  TablePagination,
  PaginationSummary,
  PaginationControls,
  PaginationNavButton,
  PaginationPages,
  PaginationPageButton,
  PaginationArrow,
} from "./styles";
import OVERVIEW_STATS, {
  OVERVIEW_ACTIVITY_DATA,
  OVERVIEW_CONTENT_PERFORMANCE,
  OVERVIEW_RANGES,
  type OverviewRange,
} from "@/utils/dummyData/overviewData";
import { renderContentIcon } from "@/utils/overviewContent";
import OverviewActivityChart from "./OverviewActivityChart";

const ITEMS_PER_PAGE = 4;

export default function OverviewContent() {
  const { t } = useTranslation();
  const [range, setRange] = useState<OverviewRange>("Day");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const activityData = OVERVIEW_ACTIVITY_DATA[range];
  const totalItems = OVERVIEW_CONTENT_PERFORMANCE.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = OVERVIEW_CONTENT_PERFORMANCE.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );
  const visibleStart = totalItems === 0 ? 0 : startIndex + 1;
  const visibleEnd = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

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
          <TableScroll>
            <PerformanceTable>
              <thead>
                <tr>
                  <TableHeadCell>{t("dashboard.contentName")}</TableHeadCell>
                  <TableHeadCell $numeric>
                    {t("dashboard.pageVisits")}
                  </TableHeadCell>
                  <TableHeadCell $numeric>
                    {t("dashboard.clicks")}
                  </TableHeadCell>
                  <TableHeadCell $numeric>{t("dashboard.views")}</TableHeadCell>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((item) => (
                  <tr key={item.id}>
                    <TableNameCell>
                      <ContentMeta>
                        <ContentIcon>
                          {renderContentIcon(item.icon)}
                        </ContentIcon>
                        <ContentLabel>{item.name}</ContentLabel>
                      </ContentMeta>
                    </TableNameCell>
                    <TableBodyCell $numeric>{item.pageVisits}</TableBodyCell>
                    <TableBodyCell $numeric>{item.clicks}</TableBodyCell>
                    <TableBodyCell $numeric>{item.views}</TableBodyCell>
                  </tr>
                ))}
              </tbody>
            </PerformanceTable>
          </TableScroll>

          <TablePagination>
            <PaginationSummary>
              {t("dashboard.paginationSummary", {
                start: visibleStart,
                end: visibleEnd,
                total: totalItems,
              })}
            </PaginationSummary>
            <PaginationControls>
              <PaginationNavButton
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
              >
                <PaginationArrow>
                  <LeftIcon width={14} height={14} />
                </PaginationArrow>
                {t("dashboard.previous")}
              </PaginationNavButton>

              <PaginationPages>
                {pages.map((page) => (
                  <PaginationPageButton
                    key={page}
                    type="button"
                    $active={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                    aria-label={t("dashboard.paginationPage", { page })}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </PaginationPageButton>
                ))}
              </PaginationPages>

              <PaginationNavButton
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
              >
                {t("dashboard.next")}
                <PaginationArrow $next>
                  <LeftIcon width={14} height={14} />
                </PaginationArrow>
              </PaginationNavButton>
            </PaginationControls>
          </TablePagination>
        </TableCard>
      </PerformanceSection>
    </Wrapper>
  );
}
