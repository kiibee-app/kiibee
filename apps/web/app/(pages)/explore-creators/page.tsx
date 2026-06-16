"use client";

import React, { useMemo, useState } from "react";
import NavBar from "@/components/Layout/Navbar";
import { Main, Section } from "@/app/styles";
import ExploreCreatorsHero from "@/components/Feature/ExploreCreators/Hero";
import Footer from "@/components/Layout/Footer";
import ExploreCreators from "@/components/Feature/ExploreCreators/Creators";
import { DEFAULT_SORT, SortValue } from "@/utils/sortOptions";
import {
  sortExploreCreators,
  useExploreCreators,
} from "@/hooks/creators/useExploreCreators";
import { useExploreNavTone } from "@/hooks/useExploreNavTone";
import { useDebounce } from "@/hooks/useDebounce";
import { LocalPageContainer } from "@/app/(pages)/explore/category/[categoryName]/styles";

export default function ExploreCreatorsPage() {
  const [sortBy, setSortBy] = useState<SortValue>(DEFAULT_SORT);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery);

  const { creators, isLoading, isFetching } = useExploreCreators(
    undefined,
    debouncedSearchQuery,
  );
  const { heroRef, trendingRef, navTextTone } = useExploreNavTone();

  const sortedCreators = useMemo(
    () => sortExploreCreators(creators, sortBy),
    [creators, sortBy],
  );

  return (
    <LocalPageContainer $navTextTone={navTextTone}>
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
              creators={sortedCreators}
              isLoading={isLoading || isFetching}
            />
          </div>
        </Section>
      </Main>
      <Footer />
    </LocalPageContainer>
  );
}
