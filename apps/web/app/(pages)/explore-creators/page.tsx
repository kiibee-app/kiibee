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
import { useRefetchQueriesOnReturn } from "@/hooks/useRefetchQueriesOnReturn";
import { API } from "@/lib/http/api";

const EXPLORE_CREATORS_REFETCH_QUERY_KEYS = [[API.creators.list]] as const;

export default function ExploreCreatorsPage() {
  const [sortBy, setSortBy] = useState<SortValue>(DEFAULT_SORT);
  const { creators, isLoading } = useExploreCreators();

  useRefetchQueriesOnReturn(EXPLORE_CREATORS_REFETCH_QUERY_KEYS);

  const sortedCreators = useMemo(
    () => sortExploreCreators(creators, sortBy),
    [creators, sortBy],
  );

  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Section>
          <ExploreCreatorsHero setSortBy={setSortBy} />
          <ExploreCreators creators={sortedCreators} isLoading={isLoading} />
        </Section>
      </Main>
      <Footer />
    </PageContainer>
  );
}
