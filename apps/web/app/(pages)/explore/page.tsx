"use client";

import React, { Suspense, useState } from "react";
import NavBar from "@/components/Layout/Navbar";
import { ExploreContentWrapper, ExploreSection, Main } from "@/app/styles";
import ExploreCreatorsHero from "@/components/Feature/ExploreCreators/Hero";
import RecentlyAdded from "@/components/Feature/ExploreCreators/RecentlyAdded";
import Footer from "@/components/Layout/Footer";
import TopCreators from "@/components/Feature/ExploreCreators/TopCreators";
import TrendingContent from "@/components/Feature/ExploreCreators/TrendingContent";
import { useExploreNavTone } from "@/hooks/useExploreNavTone";
import { LocalPageContainer } from "./category/[categoryName]/styles";
import { useDebounce } from "@/hooks/useDebounce";

import LatestRelease from "@/components/Feature/ExploreCreators/LatestRelease";

export default function ExplorePage() {
  const { heroRef, trendingRef, navTextTone } = useExploreNavTone();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery);

  return (
    <LocalPageContainer $navTextTone={navTextTone}>
      <NavBar navTextTone={navTextTone} />
      <Main>
        <ExploreSection>
          <div ref={heroRef}>
            <ExploreCreatorsHero
              showControls={false}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          <div ref={trendingRef}>
            <TrendingContent search={debouncedSearchQuery} />
          </div>
          <TopCreators search={debouncedSearchQuery} />
          <Suspense fallback={null}>
            <ExploreContentWrapper>
              <LatestRelease search={debouncedSearchQuery} />
            </ExploreContentWrapper>
          </Suspense>
          <RecentlyAdded search={debouncedSearchQuery} />
        </ExploreSection>
      </Main>
      <Footer />
    </LocalPageContainer>
  );
}
