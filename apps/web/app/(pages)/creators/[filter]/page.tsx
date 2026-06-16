"use client";

import React from "react";
import { useParams } from "next/navigation";
import NavBar from "@/components/Layout/Navbar";
import { Main, Section } from "@/app/styles";
import ExploreCreatorsHero from "@/components/Feature/ExploreCreators/Hero";
import Footer from "@/components/Layout/Footer";
import ExploreCreators from "@/components/Feature/ExploreCreators/Creators";
import { useExploreCreatorsFilter } from "@/hooks/creators/useExploreCreatorsFilter";
import { useExploreNavTone } from "@/hooks/useExploreNavTone";
import { LocalPageContainer } from "@/app/(pages)/explore/category/[categoryName]/styles";
import {
  resolveExploreCreatorFilter,
  type ExploreCreatorFilter,
} from "@/utils/sortOptions";

function CreatorsFilterPageContent({
  filter,
}: {
  filter: ExploreCreatorFilter;
}) {
  const {
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    creators,
    isLoading,
    isFetching,
    pageTitle,
    showLoadMoreButton,
    handleLoadMore,
  } = useExploreCreatorsFilter(filter);

  const { heroRef, trendingRef, navTextTone } = useExploreNavTone();

  return (
    <LocalPageContainer $navTextTone={navTextTone}>
      <NavBar navTextTone={navTextTone} />
      <Main>
        <Section>
          <div ref={heroRef}>
            <ExploreCreatorsHero
              title={pageTitle}
              sortBy={sortBy}
              setSortBy={setSortBy}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          <div ref={trendingRef}>
            <ExploreCreators
              creators={creators}
              isLoading={isLoading || isFetching}
              showLoadMoreButton={showLoadMoreButton}
              onLoadMore={handleLoadMore}
            />
          </div>
        </Section>
      </Main>
      <Footer />
    </LocalPageContainer>
  );
}

export default function CreatorsFilterPage() {
  const { filter: rawFilter } = useParams<{ filter?: string }>();
  const filter = resolveExploreCreatorFilter(rawFilter);

  return <CreatorsFilterPageContent key={filter} filter={filter} />;
}
