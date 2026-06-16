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
import { isString } from "@/utils/Constants";
import { SORT_ALL } from "@/utils/sortOptions";

function CreatorsFilterPageContent({ filter }: { filter: string }) {
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
  const params = useParams();
  const rawFilter = params?.filter;
  const filter = isString(rawFilter) ? rawFilter : SORT_ALL;

  return <CreatorsFilterPageContent key={filter} filter={filter} />;
}
