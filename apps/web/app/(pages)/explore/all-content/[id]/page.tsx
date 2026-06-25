"use client";

import React, { useMemo, useRef, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Main } from "@/app/styles";
import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import SearchBar from "@/components/UI/SearchBar";
import SortDropdown from "@/components/UI/SortDropdown";
import { useExploreNavTone } from "@/hooks/useExploreNavTone";
import { useAllContent } from "@/hooks/feed/useAllContent";
import { useClickOutside } from "@/hooks/useClickOutside";
import { getCategorySortOptions } from "@/utils/sortOptions";
import { ESCAPE, EXPLORE_PAGE_SIZE, KEYDOWN, STRING } from "@/utils/Constants";
import Skeleton from "@/components/UI/Skeleton";
import GenericEmptyState from "@/components/UI/GenericEmptyState";
import CreatorFiltersControl from "@/components/Feature/ExploreCreators/Hero/CreatorsFilters";
import {
  Hero,
  Inner,
  Content,
  Title,
  HeroTitleText,
} from "@/components/Feature/ExploreCreators/Hero/styles";
import {
  MainContent,
  CardsGrid,
  ResultsState,
  LoadMoreContainer,
  LoadMoreButton,
  LocalPageContainer,
  SortDropdownWrapper,
  LocalControls,
  DesktopSearchBarContainer,
  MobileSearchBarContainer,
} from "./styles";

function AllContentExplorePageContent() {
  const { t } = useTranslation();
  const sortOptions = useMemo(() => getCategorySortOptions(t), [t]);

  const params = useParams();

  const rawId = params?.id;
  const id = typeof rawId === STRING ? (rawId as string) : "";

  const { heroRef, trendingRef, navTextTone } = useExploreNavTone();

  const {
    title,
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
    categoryLabels,
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
  } = useAllContent(id);

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
    setSelectedRating: (rating: number) => setSelectedRating(rating),
    toggleSection,
    toggleOption,
    handlePriceChange,
  };

  const visibleCreators = useMemo(() => {
    return showAllCreators
      ? allCreatorLabels
      : allCreatorLabels.slice(0, DEFAULT_VISIBLE_CREATORS);
  }, [allCreatorLabels, showAllCreators, DEFAULT_VISIBLE_CREATORS]);

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: EXPLORE_PAGE_SIZE }).map((_, i) => (
        <Skeleton.Card key={i} />
      ));
    }

    return tutorials.length > 0 ? (
      tutorials.map((tutorial) => (
        <TutorialCard key={tutorial.id} tutorial={tutorial} />
      ))
    ) : (
      <ResultsState>
        <GenericEmptyState title={t("nav.explore.noResults")} />
      </ResultsState>
    );
  };

  return (
    <LocalPageContainer $navTextTone={navTextTone}>
      <NavBar navTextTone={navTextTone} />
      <Main>
        <div ref={heroRef}>
          <Hero>
            <Inner>
              <Content>
                <Title>
                  <HeroTitleText>{title}</HeroTitleText>
                </Title>
                <LocalControls>
                  <MobileSearchBarContainer>
                    <SearchBar
                      placeholder={t("creators.search")}
                      value={searchValue}
                      onChange={setSearchValue}
                    />
                  </MobileSearchBarContainer>

                  <CreatorFiltersControl
                    refs={filterRefs}
                    state={filterState}
                    actions={filterActions}
                    categoryLabels={categoryLabels}
                    formatLabels={formatLabels}
                    creatorLabels={visibleCreators}
                    defaultVisibleCreators={DEFAULT_VISIBLE_CREATORS}
                    showButton={true}
                  />

                  <DesktopSearchBarContainer>
                    <SearchBar
                      placeholder={t("creators.search")}
                      value={searchValue}
                      onChange={setSearchValue}
                    />
                  </DesktopSearchBarContainer>

                  <SortDropdownWrapper>
                    <SortDropdown
                      options={sortOptions}
                      value={sortOption}
                      onChange={setSortOption}
                      label={t("creators.sort")}
                    />
                  </SortDropdownWrapper>
                </LocalControls>
              </Content>
            </Inner>
          </Hero>
        </div>

        <div ref={trendingRef}>
          <MainContent>
            <CardsGrid $isFetching={isFetching}>{renderContent()}</CardsGrid>

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

export default function AllContentExplorePage() {
  return (
    <Suspense fallback={null}>
      <AllContentExplorePageContent />
    </Suspense>
  );
}
