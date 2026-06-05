"use client";

import React, { useMemo, useRef, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Main } from "@/app/styles";
import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import SearchBar from "@/components/UI/SearchBar";
import SortDropdown from "@/components/UI/SortDropdown";
import { FilterIcon } from "@/assets/icons/filterIcon";
import { ArrowIcon } from "@/assets/icons/arrowIcon";
import { useExploreNavTone } from "@/hooks/useExploreNavTone";
import { useCategoryContent } from "@/hooks/feed/useCategoryContent";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Directions } from "@/utils/ui";
import { getCategorySortOptions } from "@/utils/sortOptions";
import {
  FILTER_SECTION_CREATORS,
  FILTER_SECTION_FORMATS,
  FILTER_SECTION_PRICE,
  FILTER_SECTION_RATING,
  ESCAPE,
  KEYDOWN,
  STRING,
} from "@/utils/Constants";
import PriceFiltersSection from "@/components/Feature/ExploreCreators/Hero/CreatorsFilters/PriceFiltersSection";
import RatingFiltersSection from "@/components/Feature/ExploreCreators/Hero/CreatorsFilters/RatingFiltersSection";
import FilterAccordionSection from "@/components/Feature/ExploreCreators/Hero/CreatorsFilters/FilterAccordionSection";
import {
  Hero,
  Inner,
  Content,
  Title,
  HeroTitleText,
  Controls,
  FilterControlWrap,
  FilterBtn,
  FilterButtonText,
  CheckboxControl,
  CheckboxInput,
  OptionLabel,
  OptionList,
  OptionText,
  FilterSections,
  FilterOverlay,
  FilterHeader,
  FilterTitle,
  SectionIcon,
  ShowMoreButton,
  ShowMoreText,
} from "@/components/Feature/ExploreCreators/Hero/styles";
import {
  MainContent,
  CardsGrid,
  ResultsState,
  LoadMoreContainer,
  LoadMoreButton,
  SortDropdownWrapper,
  LocalPageContainer,
} from "./styles";

function CategoryExplorePageContent() {
  const { t } = useTranslation();

  const sortOptions = useMemo(() => getCategorySortOptions(t), [t]);
  const theme = useTheme();
  const params = useParams();

  const rawCategory = params?.categoryName;
  const categoryName =
    typeof rawCategory === STRING ? (rawCategory as string) : "";
  const { heroRef, trendingRef, navTextTone } = useExploreNavTone();
  const {
    categoryDisplayName,
    tutorials,
    isLoading,
    isFetching,
    searchValue,
    setSearchValue,
    sortOption,
    setSortOption,
    showLoadMoreButton,
    handleLoadMore,
    allCreatorLabels,
    formatLabels,
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
  } = useCategoryContent(categoryName);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterOverlayRef = useRef<HTMLDivElement>(null);

  const filterClickOutsideRefs = useMemo(
    () => [filterButtonRef, filterOverlayRef],
    [filterButtonRef, filterOverlayRef],
  );

  useClickOutside({
    refs: filterClickOutsideRefs,
    enabled: isFilterOpen,
    handler: toggleFilter,
  });
  useEffect(() => {
    if (!isFilterOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ESCAPE) {
        toggleFilter();
      }
    };

    document.addEventListener(KEYDOWN, handleKeyDown);
    return () => {
      document.removeEventListener(KEYDOWN, handleKeyDown);
    };
  }, [isFilterOpen, toggleFilter]);

  const renderSectionIcon = (isOpen: boolean) => (
    <SectionIcon>
      <ArrowIcon
        color={theme.colors.neutral.GRAY_400}
        width={18}
        height={10}
        direction={isOpen ? Directions.DOWN : Directions.RIGHT}
      />
    </SectionIcon>
  );
  const renderOptionList = (
    group: typeof FILTER_SECTION_CREATORS | typeof FILTER_SECTION_FORMATS,
    options: typeof allCreatorLabels,
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
  const visibleCreators = useMemo(() => {
    return showAllCreators
      ? allCreatorLabels
      : allCreatorLabels.slice(0, DEFAULT_VISIBLE_CREATORS);
  }, [allCreatorLabels, showAllCreators, DEFAULT_VISIBLE_CREATORS]);

  return (
    <LocalPageContainer $navTextTone={navTextTone}>
      <NavBar navTextTone={navTextTone} />
      <Main>
        <div ref={heroRef}>
          <Hero>
            <Inner>
              <Content>
                <Title>
                  <HeroTitleText>{categoryDisplayName}</HeroTitleText>
                </Title>
                <Controls>
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
                      <FilterButtonText>
                        {t("creators.filter")}
                      </FilterButtonText>
                    </FilterBtn>

                    {isFilterOpen && (
                      <FilterOverlay
                        id="creator-filters-overlay"
                        ref={filterOverlayRef}
                        role="region"
                        aria-label={t("creators.filters.title")}
                      >
                        <FilterHeader>
                          <FilterTitle>
                            {t("creators.filters.title")}
                          </FilterTitle>
                        </FilterHeader>
                        <FilterSections>
                          <FilterAccordionSection
                            title={t("creators.filters.sections.creators")}
                            isOpen={expandedSection === FILTER_SECTION_CREATORS}
                            onToggle={() =>
                              toggleSection(FILTER_SECTION_CREATORS)
                            }
                            icon={renderSectionIcon(
                              expandedSection === FILTER_SECTION_CREATORS,
                            )}
                          >
                            {renderOptionList(
                              FILTER_SECTION_CREATORS,
                              visibleCreators,
                            )}
                            {allCreatorLabels.length >
                              DEFAULT_VISIBLE_CREATORS &&
                              !showAllCreators && (
                                <ShowMoreButton
                                  type="button"
                                  onClick={() => setShowAllCreators(true)}
                                >
                                  <ShowMoreText>
                                    {t("creators.filters.showMore")}
                                  </ShowMoreText>
                                </ShowMoreButton>
                              )}
                          </FilterAccordionSection>

                          <FilterAccordionSection
                            title={t("creators.filters.sections.formats")}
                            isOpen={expandedSection === FILTER_SECTION_FORMATS}
                            onToggle={() =>
                              toggleSection(FILTER_SECTION_FORMATS)
                            }
                            icon={renderSectionIcon(
                              expandedSection === FILTER_SECTION_FORMATS,
                            )}
                          >
                            {renderOptionList(
                              FILTER_SECTION_FORMATS,
                              formatLabels,
                            )}
                          </FilterAccordionSection>
                          <FilterAccordionSection
                            title={t("creators.filters.sections.price")}
                            isOpen={expandedSection === FILTER_SECTION_PRICE}
                            onToggle={() => toggleSection(FILTER_SECTION_PRICE)}
                            icon={renderSectionIcon(
                              expandedSection === FILTER_SECTION_PRICE,
                            )}
                          >
                            <PriceFiltersSection
                              priceRange={priceRange}
                              handlePriceChange={handlePriceChange}
                            />
                          </FilterAccordionSection>

                          <FilterAccordionSection
                            title={t("creators.filters.sections.rating")}
                            isOpen={expandedSection === FILTER_SECTION_RATING}
                            onToggle={() =>
                              toggleSection(FILTER_SECTION_RATING)
                            }
                            icon={renderSectionIcon(
                              expandedSection === FILTER_SECTION_RATING,
                            )}
                          >
                            <RatingFiltersSection
                              selectedRating={selectedRating}
                              setSelectedRating={setSelectedRating}
                            />
                          </FilterAccordionSection>
                        </FilterSections>
                      </FilterOverlay>
                    )}
                  </FilterControlWrap>

                  <SearchBar
                    placeholder={t("creators.search")}
                    value={searchValue}
                    onChange={setSearchValue}
                  />

                  <SortDropdownWrapper>
                    <SortDropdown
                      options={sortOptions}
                      value={sortOption}
                      onChange={setSortOption}
                      label={t("creators.sort")}
                      width="auto"
                      maxWidth="280px"
                    />
                  </SortDropdownWrapper>
                </Controls>
              </Content>
            </Inner>
          </Hero>
        </div>

        <div ref={trendingRef}>
          <MainContent>
            <CardsGrid $isFetching={isFetching}>
              {isLoading ? (
                <ResultsState>
                  <span>{t("nav.explore.loading")}</span>
                </ResultsState>
              ) : tutorials.length > 0 ? (
                tutorials.map((tutorial) => (
                  <TutorialCard key={tutorial.id} tutorial={tutorial} />
                ))
              ) : (
                <ResultsState>
                  <span>{t("nav.explore.noResults")}</span>
                </ResultsState>
              )}
            </CardsGrid>

            {showLoadMoreButton && !isLoading && (
              <LoadMoreContainer>
                <LoadMoreButton
                  variant="primary"
                  onClick={handleLoadMore}
                  type="button"
                >
                  {t("creators.loadMore")}
                </LoadMoreButton>
              </LoadMoreContainer>
            )}
          </MainContent>
        </div>
      </Main>
      <Footer />
    </LocalPageContainer>
  );
}

export default function CategoryExplorePage() {
  return (
    <Suspense fallback={null}>
      <CategoryExplorePageContent />
    </Suspense>
  );
}
