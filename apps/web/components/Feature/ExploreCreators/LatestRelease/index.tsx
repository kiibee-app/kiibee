"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import { MonoText } from "@/components/UI/Monotext";
import { ACCESS_TYPE_FREE, VARIANT } from "@/utils/Constants";
import { useCreatorFilters } from "@/hooks/useCreatorFilters";
import CreatorFiltersControl from "../Hero/CreatorsFilters";
import {
  EXPLORE_FEED_TYPE,
  type ExploreContentFilters,
  type ExploreFeedType,
  useExploreContent,
  useExploreFilterOptions,
  withoutAllFilterOption,
} from "@/hooks/feed/useExploreContent";
import { useTranslation } from "react-i18next";
import { FilterSectionKey } from "@/types/filters";
import {
  CardsGrid,
  ContentGrid,
  FiltersColumn,
  HeaderTabs,
  HeaderWrap,
  ResultsState,
  Section,
  TabButton,
} from "./styles";
import { tabs } from "@/utils/common";

const EXPLORE_TABS: { label: string; type: ExploreFeedType }[] = [
  { label: tabs[0], type: EXPLORE_FEED_TYPE.NEW },
  { label: tabs[1], type: EXPLORE_FEED_TYPE.TRENDING },
  { label: tabs[2], type: EXPLORE_FEED_TYPE.CREATED_FOR_YOU },
];

const URL_FORMAT_IDS = new Set(["video", "audio", "pdf", "epub", "web"]);

function normalizeUrlFormat(format: string | null) {
  if (!format) return null;

  const normalized = format.trim().toLowerCase();

  return URL_FORMAT_IDS.has(normalized) ? normalized : null;
}

function getInitialExploreType(
  filter: string | null,
  sort: string | null,
): ExploreFeedType {
  if (sort === "popular") return EXPLORE_FEED_TYPE.TRENDING;
  if (filter === EXPLORE_FEED_TYPE.NEW) return EXPLORE_FEED_TYPE.NEW;

  return EXPLORE_FEED_TYPE.NEW;
}

export default function LatestRelease() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterOverlayRef = useRef<HTMLDivElement>(null);

  const urlFilter = searchParams.get("filter");
  const urlFormat = normalizeUrlFormat(searchParams.get("format"));
  const urlAccessType = urlFilter === ACCESS_TYPE_FREE ? ACCESS_TYPE_FREE : "";
  const initialExploreType = getInitialExploreType(
    urlFilter,
    searchParams.get("sort"),
  );
  const [activeExploreType, setActiveExploreType] =
    useState<ExploreFeedType>(initialExploreType);

  useEffect(() => {
    setActiveExploreType(initialExploreType);
  }, [initialExploreType]);

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
    type: activeExploreType,
    filters: exploreFilters,
  });

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
              key={tab.type}
              variant={
                activeExploreType === tab.type
                  ? VARIANT.PRIMARY
                  : VARIANT.SECONDARY
              }
              size="sm"
              $active={activeExploreType === tab.type}
              onClick={() => setActiveExploreType(tab.type)}
            >
              <MonoText $use="Body_Medium">{tab.label}</MonoText>
            </TabButton>
          ))}
        </HeaderTabs>
      </HeaderWrap>

      <ContentGrid>
        <FiltersColumn>
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

        <div>
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
        </div>
      </ContentGrid>
    </Section>
  );
}
