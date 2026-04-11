"use client";

import React from "react";
import NavBar from "@/components/Layout/Navbar";
import { ExploreSection, Main, PageContainer } from "@/app/styles";
import ExploreCreatorsHero from "@/components/Feature/ExploreCreators/Hero";
import RecentlyAdded from "@/components/Feature/ExploreCreators/RecentlyAdded";
import Footer from "@/components/Layout/Footer";
import TopCreators from "@/components/Feature/ExploreCreators/TopCreators";

export default function ExplorePage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <ExploreSection>
          <ExploreCreatorsHero showControls={false} />
          <TopCreators />
          <RecentlyAdded />
        </ExploreSection>
      </Main>
      <Footer />
    </PageContainer>
  );
}
