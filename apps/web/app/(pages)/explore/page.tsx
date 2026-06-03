"use client";

import React from "react";
import NavBar from "@/components/Layout/Navbar";
import { ExploreSection, Main, PageContainer } from "@/app/styles";
import ExploreCreatorsHero from "@/components/Feature/ExploreCreators/Hero";
import RecentlyAdded from "@/components/Feature/ExploreCreators/RecentlyAdded";
import Footer from "@/components/Layout/Footer";
import TopCreators from "@/components/Feature/ExploreCreators/TopCreators";
import TrendingContent from "@/components/Feature/ExploreCreators/TrendingContent";
import LatestRelease from "@/components/Feature/ExploreCreators/LatestRelease";
import { useExploreNavTone } from "@/hooks/useExploreNavTone";
import { useRefetchQueriesOnReturn } from "@/hooks/useRefetchQueriesOnReturn";
import { API } from "@/lib/http/api";

const REFETCH_QUERY_KEYS = [
  [API.creators.list],
  [API.feed.trending],
  [API.feed.recent],
] as const;

export default function ExplorePage() {
  const { heroRef, trendingRef, navTextTone } = useExploreNavTone();

  useRefetchQueriesOnReturn(REFETCH_QUERY_KEYS);

  return (
    <PageContainer>
      <NavBar navTextTone={navTextTone} />
      <Main>
        <ExploreSection>
          <div ref={heroRef}>
            <ExploreCreatorsHero showControls={false} />
          </div>
          <div ref={trendingRef}>
            <TrendingContent />
          </div>
          <TopCreators />
          <LatestRelease />
          <RecentlyAdded />
        </ExploreSection>
      </Main>
      <Footer />
    </PageContainer>
  );
}
