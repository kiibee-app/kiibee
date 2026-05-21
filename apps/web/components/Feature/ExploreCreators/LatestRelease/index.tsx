"use client";

import React, { useMemo, useRef } from "react";
import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import { latestReleaseVideos } from "@/utils/data";
import { MonoText } from "@/components/UI/Monotext";
import { VARIANT } from "@/utils/Constants";
import { useCreatorFilters } from "@/hooks/useCreatorFilters";
import CreatorFiltersControl from "../Hero/CreatorsFilters";
import {
  CATEGORY_OPTION_KEYS,
  CREATOR_OPTIONS,
  FORMAT_OPTION_KEYS,
} from "@/utils/creatorFilters";
import { useTranslation } from "react-i18next";
import { FilterSectionKey } from "@/types/filters";
import {
  CardsGrid,
  ContentGrid,
  FiltersColumn,
  HeaderTabs,
  HeaderWrap,
  Section,
  TabButton,
} from "./styles";
import { tabs } from "@/utils/common";

export default function LatestRelease() {
  const { t } = useTranslation();

  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterOverlayRef = useRef<HTMLDivElement>(null);

  const categoryLabels = useMemo(
    () =>
      CATEGORY_OPTION_KEYS.map((key) => ({
        key,
        label: t(`creators.filters.options.categories.${key}`),
      })),
    [t],
  );

  const formatLabels = useMemo(
    () =>
      FORMAT_OPTION_KEYS.map((key) => ({
        key,
        label: t(`creators.filters.options.formats.${key}`),
      })),
    [t],
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
    categoryOptions: [...CATEGORY_OPTION_KEYS],
    formatOptions: [...FORMAT_OPTION_KEYS],
  });

  const visibleCreators = showAllCreators
    ? CREATOR_OPTIONS
    : CREATOR_OPTIONS.slice(0, DEFAULT_VISIBLE_CREATORS);

  const creatorLabels = visibleCreators.map((key) => ({
    key,
    label: key,
  }));

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
          {tabs.map((tab, index) => (
            <TabButton
              key={tab}
              variant={index === 0 ? VARIANT.PRIMARY : VARIANT.SECONDARY}
              size="sm"
              $active={index === 0}
            >
              <MonoText $use="Body_Medium">{tab}</MonoText>
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
            creatorLabels={creatorLabels}
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
            {latestReleaseVideos.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </CardsGrid>
        </div>
      </ContentGrid>
    </Section>
  );
}
