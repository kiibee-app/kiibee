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
  const [searchQuery, setSearchQuery] = useState("");
  const { creators, isLoading } = useExploreCreators();
  const { heroRef, trendingRef, navTextTone } = useExploreNavTone();

  const sortedCreators = useMemo(
    () => sortExploreCreators(creators, sortBy),
    [creators, sortBy],
  );

  const filteredCreators = useMemo(() => {
    if (!searchQuery.trim()) return sortedCreators;
    const query = searchQuery.toLowerCase();
    return sortedCreators.filter((creator) =>
      creator.name.toLowerCase().includes(query),
    );
  }, [sortedCreators, searchQuery]);

  return (
    <PageContainer>
      <NavBar navTextTone={navTextTone} />
      <Main>
        <Section>
          <div ref={heroRef}>
            <ExploreCreatorsHero
              setSortBy={setSortBy}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          <div ref={trendingRef}>
            <ExploreCreators
              creators={filteredCreators}
              isLoading={isLoading}
            />
          </div>
        </Section>
      </Main>
      <Footer />
    </PageContainer>
  );
}
