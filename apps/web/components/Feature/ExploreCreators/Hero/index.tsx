"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import { ArrowIcon } from "@/assets/icons/arrowIcon";
import { FilterIcon } from "@/assets/icons/filterIcon";
import { useClickOutside } from "@/hooks/useClickOutside";
import SearchBar from "@/components/UI/SearchBar";
import SortDropdown from "@/components/UI/SortDropdown";
import { DEFAULT_SORT, SORT_OPTIONS, SortValue } from "@/utils/sortOptions";
import { Directions, INPUT_TYPE, KEYBOARD_KEYS } from "@/utils/ui";
import { CREATORS } from "@/utils/translationKeys";

import {
  CheckboxControl,
  CheckboxInput,
  Hero,
  HeroTitleText,
  Inner,
  Content,
  Title,
  Controls,
  FilterControlWrap,
  FilterBtn,
  FilterButtonText,
  FilterHeader,
  FilterOverlay,
  FilterSection,
  FilterSectionBody,
  FilterSectionBodyInner,
  FilterSectionButton,
  FilterSectionTitle,
  FilterSections,
  FilterTitle,
  OptionLabel,
  OptionList,
  OptionText,
  PriceField,
  PriceFieldLabel,
  PriceFields,
  PriceInput,
  PriceInputWrapper,
  PriceValue,
  RatingList,
  RatingOption,
  RatingStars,
  SectionIcon,
  ShowMoreButton,
  ShowMoreText,
  StarIcon,
  StarIconWrap,
} from "./styles";

import { useCreatorFilters } from "@/hooks/useCreatorFilters";
import {
  CATEGORY_OPTION_KEYS,
  CREATOR_OPTIONS,
  FilterGroupKey,
  filterGroupMap,
  FORMAT_OPTION_KEYS,
  RATING_OPTIONS,
} from "@/utils/creatorFilters";
import { ExploreCreatorsHeroProps } from "@/types/filters";

export default function ExploreCreatorsHero({
  showControls = true,
  setSortBy,
}: ExploreCreatorsHeroProps) {
  const { t } = useTranslation();
  const theme = useTheme();
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

  const renderOptionList = (
    group: FilterGroupKey,
    options: { key: string; label: string }[],
  ) => (
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
  );

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
              <FilterControlWrap>
                <FilterBtn
                  ref={filterButtonRef}
                  type="button"
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
                      <FilterTitle as="h2">
                        {t("creators.filters.title")}
                      </FilterTitle>
                    </FilterHeader>
                    <FilterSections>
                      <FilterSection>
                        <FilterSectionButton
                          type="button"
                          onClick={() => toggleSection(filterGroupMap.creators)}
                          aria-expanded={
                            expandedSection === filterGroupMap.creators
                          }
                        >
                          <FilterSectionTitle>
                            {t("creators.filters.sections.creators")}
                          </FilterSectionTitle>
                          <SectionIcon>
                            <ArrowIcon
                              color={theme.colors.neutral.GRAY_400}
                              width={18}
                              height={10}
                              direction={
                                expandedSection === filterGroupMap.creators
                                  ? Directions.DOWN
                                  : Directions.RIGHT
                              }
                            />
                          </SectionIcon>
                        </FilterSectionButton>
                        <FilterSectionBody
                          $open={expandedSection === filterGroupMap.creators}
                        >
                          <FilterSectionBodyInner
                            $open={expandedSection === filterGroupMap.creators}
                          >
                            {renderOptionList(
                              filterGroupMap.creators,
                              creatorLabels,
                            )}
                            {CREATOR_OPTIONS.length >
                              DEFAULT_VISIBLE_CREATORS && !showAllCreators ? (
                              <ShowMoreButton
                                type="button"
                                onClick={() => setShowAllCreators(true)}
                              >
                                <ShowMoreText>
                                  {t("creators.filters.showMore")}
                                </ShowMoreText>
                              </ShowMoreButton>
                            ) : null}
                          </FilterSectionBodyInner>
                        </FilterSectionBody>
                      </FilterSection>

                      <FilterSection>
                        <FilterSectionButton
                          type="button"
                          onClick={() =>
                            toggleSection(filterGroupMap.categories)
                          }
                          aria-expanded={
                            expandedSection === filterGroupMap.categories
                          }
                        >
                          <FilterSectionTitle>
                            {t("creators.filters.sections.categories")}
                          </FilterSectionTitle>
                          <SectionIcon>
                            <ArrowIcon
                              color={theme.colors.neutral.GRAY_400}
                              width={18}
                              height={10}
                              direction={
                                expandedSection === filterGroupMap.categories
                                  ? Directions.DOWN
                                  : Directions.RIGHT
                              }
                            />
                          </SectionIcon>
                        </FilterSectionButton>
                        <FilterSectionBody
                          $open={expandedSection === filterGroupMap.categories}
                        >
                          <FilterSectionBodyInner
                            $open={
                              expandedSection === filterGroupMap.categories
                            }
                          >
                            {renderOptionList(
                              filterGroupMap.categories,
                              categoryLabels,
                            )}
                          </FilterSectionBodyInner>
                        </FilterSectionBody>
                      </FilterSection>

                      <FilterSection>
                        <FilterSectionButton
                          type="button"
                          onClick={() => toggleSection(filterGroupMap.formats)}
                          aria-expanded={
                            expandedSection === filterGroupMap.formats
                          }
                        >
                          <FilterSectionTitle>
                            {t("creators.filters.sections.formats")}
                          </FilterSectionTitle>
                          <SectionIcon>
                            <ArrowIcon
                              color={theme.colors.neutral.GRAY_400}
                              width={18}
                              height={10}
                              direction={
                                expandedSection === filterGroupMap.formats
                                  ? Directions.DOWN
                                  : Directions.RIGHT
                              }
                            />
                          </SectionIcon>
                        </FilterSectionButton>
                        <FilterSectionBody
                          $open={expandedSection === filterGroupMap.formats}
                        >
                          <FilterSectionBodyInner
                            $open={expandedSection === filterGroupMap.formats}
                          >
                            {renderOptionList(
                              filterGroupMap.formats,
                              formatLabels,
                            )}
                          </FilterSectionBodyInner>
                        </FilterSectionBody>
                      </FilterSection>

                      <FilterSection>
                        <FilterSectionButton
                          type="button"
                          onClick={() => toggleSection("price")}
                          aria-expanded={expandedSection === "price"}
                        >
                          <FilterSectionTitle>
                            {t("creators.filters.sections.price")}
                          </FilterSectionTitle>
                          <SectionIcon>
                            <ArrowIcon
                              color={theme.colors.neutral.GRAY_400}
                              width={18}
                              height={10}
                              direction={
                                expandedSection === "price"
                                  ? Directions.DOWN
                                  : Directions.RIGHT
                              }
                            />
                          </SectionIcon>
                        </FilterSectionButton>
                        <FilterSectionBody $open={expandedSection === "price"}>
                          <FilterSectionBodyInner
                            $open={expandedSection === "price"}
                          >
                            <PriceFields>
                              <PriceField>
                                <PriceFieldLabel>
                                  {t("creators.filters.price.minimum")}
                                </PriceFieldLabel>
                                <PriceInputWrapper>
                                  <PriceValue>
                                    {t("creators.filters.price.currency")}
                                  </PriceValue>
                                  <PriceInput
                                    type={INPUT_TYPE.TEXT}
                                    inputMode="numeric"
                                    placeholder="0"
                                    value={priceRange.min}
                                    onChange={handlePriceChange("min")}
                                  />
                                </PriceInputWrapper>
                              </PriceField>
                              <PriceField>
                                <PriceFieldLabel>
                                  {t("creators.filters.price.maximum")}
                                </PriceFieldLabel>
                                <PriceInputWrapper>
                                  <PriceValue>
                                    {t("creators.filters.price.currency")}
                                  </PriceValue>
                                  <PriceInput
                                    type={INPUT_TYPE.TEXT}
                                    inputMode="numeric"
                                    placeholder="0"
                                    value={priceRange.max}
                                    onChange={handlePriceChange("max")}
                                  />
                                </PriceInputWrapper>
                              </PriceField>
                            </PriceFields>
                          </FilterSectionBodyInner>
                        </FilterSectionBody>
                      </FilterSection>

                      <FilterSection>
                        <FilterSectionButton
                          type="button"
                          onClick={() => toggleSection("rating")}
                          aria-expanded={expandedSection === "rating"}
                        >
                          <FilterSectionTitle>
                            {t("creators.filters.sections.rating")}
                          </FilterSectionTitle>
                          <SectionIcon>
                            <ArrowIcon
                              color={theme.colors.neutral.GRAY_400}
                              width={18}
                              height={10}
                              direction={
                                expandedSection === "rating"
                                  ? Directions.DOWN
                                  : Directions.RIGHT
                              }
                            />
                          </SectionIcon>
                        </FilterSectionButton>
                        <FilterSectionBody $open={expandedSection === "rating"}>
                          <FilterSectionBodyInner
                            $open={expandedSection === "rating"}
                          >
                            <RatingList
                              role="radiogroup"
                              aria-label={t("creators.filters.sections.rating")}
                            >
                              {RATING_OPTIONS.map((ratingValue) => {
                                const isSelected =
                                  selectedRating === ratingValue;

                                return (
                                  <RatingOption key={ratingValue}>
                                    <OptionText>
                                      <RatingStars aria-hidden="true">
                                        {Array.from(
                                          { length: 5 },
                                          (_, index) => (
                                            <StarIconWrap key={index}>
                                              <StarIcon
                                                viewBox="0 0 24 24"
                                                $filled={index < ratingValue}
                                              >
                                                <path d="M12 2.25L14.91 8.15L21.42 9.1L16.71 13.68L17.82 20.15L12 17.09L6.18 20.15L7.29 13.68L2.58 9.1L9.09 8.15L12 2.25Z" />
                                              </StarIcon>
                                            </StarIconWrap>
                                          ),
                                        )}
                                      </RatingStars>
                                    </OptionText>
                                    <CheckboxInput
                                      type="radio"
                                      name="creator-rating-filter"
                                      aria-label={`${ratingValue} ${t(
                                        "creators.filters.sections.rating",
                                      )}`}
                                      checked={isSelected}
                                      onChange={() =>
                                        setSelectedRating(ratingValue)
                                      }
                                    />
                                    <CheckboxControl
                                      $checked={isSelected}
                                      $round
                                    />
                                  </RatingOption>
                                );
                              })}
                            </RatingList>
                          </FilterSectionBodyInner>
                        </FilterSectionBody>
                      </FilterSection>
                    </FilterSections>
                  </FilterOverlay>
                ) : null}
              </FilterControlWrap>
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
