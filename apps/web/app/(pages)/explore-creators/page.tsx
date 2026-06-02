"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { useQueryClient } from "@tanstack/react-query";
import { API } from "@/lib/http/api";
import { FOCUS, PAGESHOW, VISIBILITY_CHANGE, VISIBLE } from "@/utils/common";

const REFETCH_QUERY_KEYS = [[API.creators.list]] as const;

export default function ExploreCreatorsPage() {
  const [sortBy, setSortBy] = useState<SortValue>(DEFAULT_SORT);
  const { creators, isLoading } = useExploreCreators();
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
