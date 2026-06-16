"use client";

import React from "react";
import NavBar from "@/components/Layout/Navbar";
import { Main, Section } from "@/app/styles";
import ExploreCreatorsHero from "@/components/Feature/ExploreCreators/Hero";
import Footer from "@/components/Layout/Footer";
import ExploreCreators from "@/components/Feature/ExploreCreators/Creators";
import { useExploreCreatorsFilter } from "@/hooks/creators/useExploreCreatorsFilter";
import { useExploreNavTone } from "@/hooks/useExploreNavTone";
import { LocalPageContainer } from "@/app/(pages)/explore/category/[categoryName]/styles";

export default function CreatorsFilterPage() {
  const {
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    creators,
    isLoading,
    isFetching,
    pageTitle,
  } = useExploreCreatorsFilter();

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
            />
          </div>
        </Section>
      </Main>
      <Footer />
    </LocalPageContainer>
  );
}
