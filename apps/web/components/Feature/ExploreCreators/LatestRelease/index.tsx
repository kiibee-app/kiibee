"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import { MonoText } from "@/components/UI/Monotext";
import { ACCESS_TYPE_FREE, VARIANT } from "@/utils/Constants";
import { useCreatorFilters } from "@/hooks/useCreatorFilters";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import CreatorFiltersControl from "../Hero/CreatorsFilters";
import {
  EXPLORE_CONTENT_SORT,
  type ExploreContentFilters,
  type ExploreContentSort,
  useExploreContent,
  useExploreFilterOptions,
  withoutAllFilterOption,
} from "@/hooks/feed/useExploreContent";
import { useTranslation } from "react-i18next";
import { FilterSectionKey } from "@/types/filters";
import {
  CardsColumn,
  CardsGrid,
  ContentGrid,
  FiltersColumn,
  HeaderTabs,
  HeaderWrap,
  LoadMoreButton,
  LoadMoreContainer,
  ResultsState,
  Section,
  TabButton,
} from "./styles";
import { tabs } from "@/utils/common";

const EXPLORE_TABS: { label: string; sort: ExploreContentSort }[] = [
  { label: tabs[0], sort: EXPLORE_CONTENT_SORT.NEW },
  { label: tabs[1], sort: EXPLORE_CONTENT_SORT.POPULAR },
  { label: tabs[2], sort: EXPLORE_CONTENT_SORT.ALL },
];

const URL_FORMAT_IDS = new Set(["video", "audio", "pdf", "epub", "web"]);

function normalizeUrlFormat(format: string | null) {
  if (!format) return null;

  const normalized = format.trim().toLowerCase();

  return URL_FORMAT_IDS.has(normalized) ? normalized : null;
}

function getInitialExploreSort(
  filter: string | null,
  sort: string | null,
): ExploreContentSort {
  if (sort === EXPLORE_CONTENT_SORT.POPULAR) {
    return EXPLORE_CONTENT_SORT.POPULAR;
  }

  if (filter === EXPLORE_CONTENT_SORT.NEW) {
    return EXPLORE_CONTENT_SORT.NEW;
  }

  return EXPLORE_CONTENT_SORT.NEW;
}

export default function LatestRelease() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  useScrollAnimation({
    sidebarSelector: "[data-sidebar]",
    innerSelector: "[data-sidebar] > div",
    cardsSelector:
      "[data-sidebar] ~ * article, [data-sidebar] ~ * [class*='Card']",
  });

  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterOverlayRef = useRef<HTMLDivElement>(null);

  const urlFilter = searchParams.get("filter");
  const urlFormat = normalizeUrlFormat(searchParams.get("format"));
  const urlAccessType = urlFilter === ACCESS_TYPE_FREE ? ACCESS_TYPE_FREE : "";
  const initialExploreSort = getInitialExploreSort(
    urlFilter,
    searchParams.get("sort"),
  );
  const [activeExploreSort, setActiveExploreSort] =
    useState<ExploreContentSort>(initialExploreSort);
  const [limit, setLimit] = useState(12);

  useEffect(() => {
    setActiveExploreSort(initialExploreSort);
  }, [initialExploreSort]);

  const handleSortChange = (sort: ExploreContentSort) => {
    setActiveExploreSort(sort);
    setLimit(12);
  };

  const {
    creatorLabels: allCreatorLabels,
    categoryLabels,
    formatLabels,
    categoryOptions,
    formatOptions,
  } = useExploreFilterOptions();

  const initialSelectedOptions = useMemo(
    () => ({
      formats: urlFormat ? [urlFormat] : [],
    }),
    [urlFormat],
  );

  const {
    isFilterOpen,
    expandedSection,
    showAllCreators,
    selectedOptions,
    priceRange,
    selectedRating,
    setShowAllCreators,
    setSelectedRating,
    toggleFilter,
    toggleSection,
    toggleOption,
    handlePriceChange,
    DEFAULT_VISIBLE_CREATORS,
  } = useCreatorFilters({
    categoryOptions,
    formatOptions,
    initialSelectedOptions,
  });

  const visibleCreators = showAllCreators
    ? allCreatorLabels
    : allCreatorLabels.slice(0, DEFAULT_VISIBLE_CREATORS);

  const selectedCategoryIds = useMemo(
    () => withoutAllFilterOption(selectedOptions.categories),
    [selectedOptions.categories],
  );
  const selectedFormatIds = useMemo(
    () => withoutAllFilterOption(selectedOptions.formats),
    [selectedOptions.formats],
  );
  const exploreFilters = useMemo(
    (): ExploreContentFilters => ({
      creatorId: selectedOptions.creators,
      categoryId: selectedCategoryIds,
      contentTypeId: selectedFormatIds,
      accessType: urlAccessType || undefined,
      minPrice: priceRange.min || undefined,
      maxPrice: priceRange.max || undefined,
      rating: selectedRating ?? undefined,
    }),
    [
      selectedOptions.creators,
      selectedCategoryIds,
      selectedFormatIds,
      urlAccessType,
      priceRange.min,
      priceRange.max,
      selectedRating,
    ],
  );
  const { tutorials, isLoading } = useExploreContent({
    sort: activeExploreSort,
    filters: exploreFilters,
    limit,
  });

  const hasMore = tutorials.length >= limit;

  const handleLoadMore = () => {
    setLimit((prev) => prev + 12);
  };

  const filterRefs = { filterButtonRef, filterOverlayRef };
  const filterState = {
    isFilterOpen,
    expandedSection,
    showAllCreators,
    selectedOptions,
    priceRange,
    selectedRating,
  };

  const filterActions = {
    toggleFilter,
    setShowAllCreators,
    setSelectedRating,
    toggleSection: (section: FilterSectionKey) => toggleSection(section),
    toggleOption,
    handlePriceChange,
  };

  return (
    <Section>
      <HeaderWrap>
        <div>
          <MonoText $use="H4_Medium">{t("nav.explore.latest")}</MonoText>
        </div>
        <HeaderTabs>
          {EXPLORE_TABS.map((tab) => (
            <TabButton
              key={tab.sort}
              variant={
                activeExploreSort === tab.sort
                  ? VARIANT.PRIMARY
                  : VARIANT.SECONDARY
              }
              size="sm"
              $active={activeExploreSort === tab.sort}
              onClick={() => handleSortChange(tab.sort)}
            >
              <MonoText $use="Body_Medium">{tab.label}</MonoText>
            </TabButton>
          ))}
        </HeaderTabs>
      </HeaderWrap>

      <ContentGrid>
        <FiltersColumn data-sidebar>
          <CreatorFiltersControl
            refs={filterRefs}
            state={filterState}
            actions={filterActions}
            categoryLabels={categoryLabels}
            formatLabels={formatLabels}
            creatorLabels={visibleCreators}
            defaultVisibleCreators={DEFAULT_VISIBLE_CREATORS}
            showButton={false}
            forceOpen
            inlineOverlay
            overlayMaxWidth="15.5rem"
            inlineOverlayWidth="49%"
          />
        </FiltersColumn>

        <CardsColumn>
          <CardsGrid>
            {isLoading ? (
              <ResultsState>
                <MonoText $use="Body_Medium">
                  {t("nav.explore.loading")}
                </MonoText>
              </ResultsState>
            ) : tutorials.length > 0 ? (
              tutorials.map((tutorial) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))
            ) : (
              <ResultsState>
                <MonoText $use="Body_Medium">
                  {t("nav.explore.noResults")}
                </MonoText>
              </ResultsState>
            )}
          </CardsGrid>
          {hasMore && !isLoading && (
            <LoadMoreContainer>
              <LoadMoreButton
                variant="primary"
                type="button"
                onClick={handleLoadMore}
              >
                {t("creators.loadMore")}
              </LoadMoreButton>
            </LoadMoreContainer>
          )}
        </CardsColumn>
      </ContentGrid>
    </Section>
  );
}
