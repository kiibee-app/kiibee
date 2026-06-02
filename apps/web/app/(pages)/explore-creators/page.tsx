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

export default function ExploreCreatorsPage() {
  const [sortBy, setSortBy] = useState<SortValue>(DEFAULT_SORT);
  const { creators, isLoading } = useExploreCreators();
  const queryClient = useQueryClient();

  useEffect(() => {
    const refetch = () => {
      void queryClient.refetchQueries({ queryKey: [API.creators.list] });
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
