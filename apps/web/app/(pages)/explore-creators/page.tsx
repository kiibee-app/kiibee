"use client";

import React, { useMemo, useState } from "react";
import NavBar from "@/components/Layout/Navbar";
import { Main, PageContainer, Section } from "@/app/styles";
import ExploreCreatorsHero from "@/components/Feature/ExploreCreators/Hero";
import Footer from "@/components/Layout/Footer";
import ExploreCreators from "@/components/Feature/ExploreCreators/Creators";
import { DEFAULT_SORT, SortValue } from "@/utils/sortOptions";
import {
  sortExploreCreators,
  useExploreCreators,
} from "@/hooks/creators/useExploreCreators";
import { useExploreNavTone } from "@/hooks/useExploreNavTone";

export default function ExploreCreatorsPage() {
  const [sortBy, setSortBy] = useState<SortValue>(DEFAULT_SORT);
  const { creators, isLoading } = useExploreCreators();
  const { heroRef, trendingRef, navTextTone } = useExploreNavTone();

  const sortedCreators = useMemo(
    () => sortExploreCreators(creators, sortBy),
    [creators, sortBy],
  );

  return (
    <PageContainer>
      <NavBar navTextTone={navTextTone} />
      <Main>
        <Section>
          <div ref={heroRef}>
            <ExploreCreatorsHero setSortBy={setSortBy} />
          </div>
          <div ref={trendingRef}>
            <ExploreCreators creators={sortedCreators} isLoading={isLoading} />
          </div>
        </Section>
      </Main>
      <Footer />
    </PageContainer>
  );
}
