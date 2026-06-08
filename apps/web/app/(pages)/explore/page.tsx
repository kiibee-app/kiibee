"use client";

import React, { Suspense } from "react";
import NavBar from "@/components/Layout/Navbar";
import {
  ExploreContentWrapper,
  ExploreSection,
  Main,
  PageContainer,
} from "@/app/styles";
import ExploreCreatorsHero from "@/components/Feature/ExploreCreators/Hero";
import RecentlyAdded from "@/components/Feature/ExploreCreators/RecentlyAdded";
import Footer from "@/components/Layout/Footer";
import TopCreators from "@/components/Feature/ExploreCreators/TopCreators";
import TrendingContent from "@/components/Feature/ExploreCreators/TrendingContent";
import LatestRelease from "@/components/Feature/ExploreCreators/LatestRelease";
import { useExploreNavTone } from "@/hooks/useExploreNavTone";

export default function ExplorePage() {
  const { heroRef, trendingRef, navTextTone } = useExploreNavTone();

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
          <Suspense fallback={null}>
            <ExploreContentWrapper>
              <LatestRelease />
            </ExploreContentWrapper>
          </Suspense>
          <RecentlyAdded />
        </ExploreSection>
      </Main>
      <Footer />
    </PageContainer>
  );
}
