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

export default function ExplorePage() {
  const { heroRef, trendingRef, navTextTone } = useExploreNavTone();
  const queryClient = useQueryClient();

  useEffect(() => {
    const refetch = () => {
      void queryClient.refetchQueries({ queryKey: [API.creators.list] });
      void queryClient.refetchQueries({ queryKey: [API.feed.trending] });
      void queryClient.refetchQueries({ queryKey: [API.feed.recent] });
    };
    const onVisible = () => {
      if (document.visibilityState === VISIBLE) refetch();
    };
    window.addEventListener(PAGESHOW, refetch);
    window.addEventListener(FOCUS, refetch);
    document.addEventListener(VISIBILITY_CHANGE, onVisible);
    return () => {
      window.removeEventListener(PAGESHOW, refetch);
      window.removeEventListener(FOCUS, refetch);
      document.removeEventListener(VISIBILITY_CHANGE, onVisible);
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
