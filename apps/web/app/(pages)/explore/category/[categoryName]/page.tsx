"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { PageContainer, Main } from "@/app/styles";
import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import SearchBar from "@/components/UI/SearchBar";
import SortDropdown from "@/components/UI/SortDropdown";
import { FilterIcon } from "@/assets/icons/filterIcon";
import { ArrowIcon } from "@/assets/icons/arrowIcon";
import { useExploreNavTone } from "@/hooks/useExploreNavTone";
import { useCategoryContent } from "@/hooks/feed/useCategoryContent";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Directions } from "@/utils/ui";
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
} from "./styles";

export default function CategoryExplorePage() {
  const { t } = useTranslation();

  const sortOptions = useMemo(
    () => [
      { label: t("creators.newest").toLowerCase(), value: "new" },
      { label: t("nav.explore.popular").toLowerCase(), value: "popular" },
      { label: t("nav.explore.freeContent").toLowerCase(), value: "free" },
      { label: t("creators.a-z").toLowerCase(), value: "a-z" },
    ],
    [t],
  );
  const theme = useTheme();
  const params = useParams();

  const categoryName =
    typeof params?.categoryName === "string" ? params.categoryName : "";
  const { heroRef, trendingRef, navTextTone } = useExploreNavTone();
  const {
    categoryDisplayName,
    tutorials,
    isLoading,
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
      if (event.key === "Escape") {
        toggleFilter();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
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
    group: "creators" | "formats",
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
    <PageContainer>
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
                          {/* Creators Accordion */}
                          <FilterAccordionSection
                            title={t("creators.filters.sections.creators")}
                            isOpen={expandedSection === "creators"}
                            onToggle={() => toggleSection("creators")}
                            icon={renderSectionIcon(
                              expandedSection === "creators",
                            )}
                          >
                            {renderOptionList("creators", visibleCreators)}
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

                          {/* Formats Accordion */}
                          <FilterAccordionSection
                            title={t("creators.filters.sections.formats")}
                            isOpen={expandedSection === "formats"}
                            onToggle={() => toggleSection("formats")}
                            icon={renderSectionIcon(
                              expandedSection === "formats",
                            )}
                          >
                            {renderOptionList("formats", formatLabels)}
                          </FilterAccordionSection>

                          {/* Price Accordion */}
                          <FilterAccordionSection
                            title={t("creators.filters.sections.price")}
                            isOpen={expandedSection === "price"}
                            onToggle={() => toggleSection("price")}
                            icon={renderSectionIcon(
                              expandedSection === "price",
                            )}
                          >
                            <PriceFiltersSection
                              priceRange={priceRange}
                              handlePriceChange={handlePriceChange}
                            />
                          </FilterAccordionSection>

                          {/* Rating Accordion */}
                          <FilterAccordionSection
                            title={t("creators.filters.sections.rating")}
                            isOpen={expandedSection === "rating"}
                            onToggle={() => toggleSection("rating")}
                            icon={renderSectionIcon(
                              expandedSection === "rating",
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

                  <SortDropdown
                    options={sortOptions}
                    value={sortOption}
                    onChange={setSortOption}
                    label={t("creators.sort")}
                  />
                </Controls>
              </Content>
            </Inner>
          </Hero>
        </div>

        <div ref={trendingRef}>
          <MainContent>
            <CardsGrid>
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
    </PageContainer>
  );
}
