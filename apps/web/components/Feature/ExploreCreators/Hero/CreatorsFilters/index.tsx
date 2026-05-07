"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import { ArrowIcon } from "@/assets/icons/arrowIcon";
import { FilterIcon } from "@/assets/icons/filterIcon";
import { FilterGroupKey } from "@/utils/creatorFilters";
import { Directions } from "@/utils/ui";
import PriceFiltersSection from "./PriceFiltersSection";
import RatingFiltersSection from "./RatingFiltersSection";
import {
  buildListSections,
  buildRenderFilterSections,
} from "@/utils/filterSections";
import FilterAccordionSection from "./FilterAccordionSection";
import {
  CheckboxControl,
  CheckboxInput,
  FilterBtn,
  FilterButtonText,
  FilterControlWrap,
  FilterHeader,
  FilterOverlay,
  FilterSections,
  FilterTitle,
  OptionLabel,
  OptionList,
  OptionText,
  SectionIcon,
} from "../styles";
import {
  CreatorFiltersControlProps,
  FilterSectionKey,
  OptionItem,
} from "@/types/exportCreators";
import { BUTTON } from "@/utils/Constants";

function CreatorFiltersControl({
  refs,
  state,
  categoryLabels,
  formatLabels,
  creatorLabels,
  defaultVisibleCreators,
  actions,
}: CreatorFiltersControlProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { filterButtonRef, filterOverlayRef } = refs;
  const {
    isFilterOpen,
    expandedSection,
    showAllCreators,
    selectedOptions,
    priceRange,
    selectedRating,
  } = state;
  const {
    toggleFilter,
    setShowAllCreators,
    setSelectedRating,
    toggleSection,
    toggleOption,
    handlePriceChange,
  } = actions;

  const renderSectionIcon = React.useCallback(
    (isOpen: boolean) => (
      <SectionIcon>
        <ArrowIcon
          color={theme.colors.neutral.GRAY_400}
          width={18}
          height={10}
          direction={isOpen ? Directions.DOWN : Directions.RIGHT}
        />
      </SectionIcon>
    ),
    [theme.colors.neutral.GRAY_400],
  );

  const renderOptionList = React.useCallback(
    (group: FilterGroupKey, options: OptionItem[]) => (
      <OptionList>
        {options.map((option) => {
          const isSelected = selectedOptions[group].includes(option.key);

          return (
            <OptionLabel key={option.key}>
              <OptionText>{option.label}</OptionText>
              <CheckboxInput
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleOption(group, option.key)}
              />
              <CheckboxControl $checked={isSelected} />
            </OptionLabel>
          );
        })}
      </OptionList>
    ),
    [selectedOptions, toggleOption],
  );

  const listSections = React.useMemo(
    () =>
      buildListSections({
        t,
        creatorLabels,
        categoryLabels,
        formatLabels,
        defaultVisibleCreators,
        showAllCreators,
        setShowAllCreators,
      }),
    [
      t,
      creatorLabels,
      categoryLabels,
      formatLabels,
      defaultVisibleCreators,
      showAllCreators,
      setShowAllCreators,
    ],
  );

  const isSectionOpen = (section: FilterSectionKey) =>
    expandedSection === section;
  const filterSections = React.useMemo(
    () =>
      buildRenderFilterSections({
        listSections,
        renderOptionList,
        priceTitle: t("creators.filters.sections.price"),
        ratingTitle: t("creators.filters.sections.rating"),
        priceContent: (
          <PriceFiltersSection
            priceRange={priceRange}
            handlePriceChange={handlePriceChange}
          />
        ),
        ratingContent: (
          <RatingFiltersSection
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
          />
        ),
      }),
    [
      listSections,
      renderOptionList,
      t,
      priceRange,
      handlePriceChange,
      selectedRating,
      setSelectedRating,
    ],
  );

  return (
    <FilterControlWrap>
      <FilterBtn
        ref={filterButtonRef}
        type={BUTTON}
        $active={isFilterOpen}
        onClick={toggleFilter}
        aria-expanded={isFilterOpen}
        aria-controls="creator-filters-overlay"
      >
        <FilterIcon color={theme.colors.primary.BLACK} />
        <FilterButtonText>{t("creators.filter")}</FilterButtonText>
      </FilterBtn>
      {isFilterOpen ? (
        <FilterOverlay
          id="creator-filters-overlay"
          ref={filterOverlayRef}
          role="region"
          aria-label={t("creators.filters.title")}
        >
          <FilterHeader>
            <FilterTitle>{t("creators.filters.title")}</FilterTitle>
          </FilterHeader>
          <FilterSections>
            {filterSections.map((section) => {
              const open = isSectionOpen(section.key);
              return (
                <FilterAccordionSection
                  key={section.key}
                  title={section.title}
                  isOpen={open}
                  onToggle={() => toggleSection(section.key)}
                  icon={renderSectionIcon(open)}
                >
                  {section.content}
                </FilterAccordionSection>
              );
            })}
          </FilterSections>
        </FilterOverlay>
      ) : null}
    </FilterControlWrap>
  );
}

export default React.memo(CreatorFiltersControl);
