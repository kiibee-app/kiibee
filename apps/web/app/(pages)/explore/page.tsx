"use client";

import React, { Suspense, useState, useEffect } from "react";
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

const LatestRelease = dynamic(
  () => import("@/components/Feature/ExploreCreators/LatestRelease"),
  { ssr: false },
);

export default function ExplorePage() {
  const { heroRef, trendingRef, navTextTone } = useExploreNavTone();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <LocalPageContainer $navTextTone={navTextTone}>
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
          <Suspense fallback={<GenericSpinner isLocal size={40} />}>
            <ExploreContentWrapper>
              <LatestRelease />
            </ExploreContentWrapper>
          </Suspense>
          <RecentlyAdded />
        </ExploreSection>
      </Main>
      <Footer />
      {!mounted && <GenericSpinner isOverlay size={48} />}
    </LocalPageContainer>
  );
}
