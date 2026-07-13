"use client";

import React, { Suspense, useState } from "react";
import NavBar from "@/components/Layout/Navbar";
import GenericSpinner from "@/components/UI/GenericSpinner";
import { ExploreContentWrapper, ExploreSection, Main } from "@/app/styles";
import ExploreCreatorsHero from "@/components/Feature/ExploreCreators/Hero";
import RecentlyAdded from "@/components/Feature/ExploreCreators/RecentlyAdded";
import Footer from "@/components/Layout/Footer";
import TopCreators from "@/components/Feature/ExploreCreators/TopCreators";
import TrendingContent from "@/components/Feature/ExploreCreators/TrendingContent";
import dynamic from "next/dynamic";
import { useExploreNavTone } from "@/hooks/useExploreNavTone";
import { LocalPageContainer } from "./category/[categoryName]/styles";
import { useMounted } from "@/utils/common";
import { useDebounce } from "@/hooks/useDebounce";

const LatestRelease = dynamic(
  () => import("@/components/Feature/ExploreCreators/LatestRelease"),
  { ssr: false },
);

export default function ExplorePage() {
  const { heroRef, trendingRef, navTextTone } = useExploreNavTone();
  const mounted = useMounted();
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
          <Suspense fallback={<GenericSpinner isLocal size={40} />}>
            <ExploreContentWrapper>
              <LatestRelease search={debouncedSearchQuery} />
            </ExploreContentWrapper>
          </Suspense>
          <RecentlyAdded search={debouncedSearchQuery} />
        </ExploreSection>
      </Main>
      <Footer />
      {!mounted && <GenericSpinner isOverlay size={48} />}
    </LocalPageContainer>
  );
}
