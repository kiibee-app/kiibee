"use client";

import React, { useEffect } from "react";
import NavBar from "@/components/Layout/Navbar";
import { ExploreSection, Main, PageContainer } from "@/app/styles";
import ExploreCreatorsHero from "@/components/Feature/ExploreCreators/Hero";
import RecentlyAdded from "@/components/Feature/ExploreCreators/RecentlyAdded";
import Footer from "@/components/Layout/Footer";
import TopCreators from "@/components/Feature/ExploreCreators/TopCreators";
import TrendingContent from "@/components/Feature/ExploreCreators/TrendingContent";
import LatestRelease from "@/components/Feature/ExploreCreators/LatestRelease";
import { useExploreNavTone } from "@/hooks/useExploreNavTone";
import { useQueryClient } from "@tanstack/react-query";
import { API } from "@/lib/http/api";
import { FOCUS, PAGESHOW, VISIBILITY_CHANGE, VISIBLE } from "@/utils/common";

const REFETCH_QUERY_KEYS = [
  [API.creators.list],
  [API.feed.trending],
  [API.feed.recent],
] as const;

export default function ExplorePage() {
  const { heroRef, trendingRef, navTextTone } = useExploreNavTone();
  const queryClient = useQueryClient();

  useEffect(() => {
    const refetchQueries = () => {
      REFETCH_QUERY_KEYS.forEach((queryKey) => {
        void queryClient.refetchQueries({ queryKey });
      });
    };

    const refetchOnVisible = () => {
      if (document.visibilityState === VISIBLE) {
        refetchQueries();
      }
    };

    window.addEventListener(PAGESHOW, refetchQueries);
    window.addEventListener(FOCUS, refetchQueries);
    document.addEventListener(VISIBILITY_CHANGE, refetchOnVisible);

    return () => {
      window.removeEventListener(PAGESHOW, refetchQueries);
      window.removeEventListener(FOCUS, refetchQueries);
      document.removeEventListener(VISIBILITY_CHANGE, refetchOnVisible);
    };
  }, [queryClient]);

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
