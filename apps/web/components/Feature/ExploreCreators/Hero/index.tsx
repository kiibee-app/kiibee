"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useClickOutside } from "@/hooks/useClickOutside";
import SearchBar from "@/components/UI/SearchBar";
import SortDropdown from "@/components/UI/SortDropdown";
import { DEFAULT_SORT, SORT_OPTIONS, SortValue } from "@/utils/sortOptions";
import { KEYBOARD_KEYS } from "@/utils/ui";
import { CREATORS } from "@/utils/translationKeys";
import CreatorFiltersControl from "./CreatorsFilters";
import { Hero, HeroTitleText, Inner, Content, Title, Controls } from "./styles";
import { useCreatorFilters } from "@/hooks/useCreatorFilters";
import {
  CATEGORY_OPTION_KEYS,
  CREATOR_OPTIONS,
  FORMAT_OPTION_KEYS,
} from "@/utils/creatorFilters";
import { ExploreCreatorsHeroProps, FilterSectionKey } from "@/types/filters";

export default function ExploreCreatorsHero({
  showControls = true,
  setSortBy,
}: ExploreCreatorsHeroProps) {
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
  const filterClickOutsideRefs = useMemo(
    () => [filterButtonRef, filterOverlayRef],
    [],
  );

  useClickOutside({
    refs: filterClickOutsideRefs,
    enabled: isFilterOpen,
    handler: toggleFilter,
  });

  useEffect(() => {
    if (!isFilterOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === KEYBOARD_KEYS.ESCAPE) {
        toggleFilter();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFilterOpen, toggleFilter]);

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
    <Hero>
      <Inner>
        <Content>
          {showControls && (
            <Title>
              <HeroTitleText>{t("creators.title")}</HeroTitleText>
            </Title>
          )}
          <Controls>
            {showControls && (
              <CreatorFiltersControl
                refs={filterRefs}
                state={filterState}
                actions={filterActions}
                categoryLabels={categoryLabels}
                formatLabels={formatLabels}
                creatorLabels={creatorLabels}
                defaultVisibleCreators={DEFAULT_VISIBLE_CREATORS}
              />
            )}
            <SearchBar placeholder={t("creators.search")} />
            {showControls && (
              <SortDropdown
                options={SORT_OPTIONS}
                value={DEFAULT_SORT}
                onChange={setSortBy}
                label={t(CREATORS.sort)}
                renderSelectedLabel={(value) =>
                  t(CREATORS.value(value as SortValue)).toLowerCase()
                }
                renderOptionLabel={(option) =>
                  t(CREATORS.value(option.value as SortValue)).toLowerCase()
                }
              />
            )}
          </Controls>
        </Content>
      </Inner>
    </Hero>
  );
}
