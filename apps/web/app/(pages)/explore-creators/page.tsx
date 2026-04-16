"use client";

import React, { useMemo, useState } from "react";
import NavBar from "@/components/Layout/Navbar";
import { Main, PageContainer, Section } from "@/app/styles";
import ExploreCreatorsHero from "@/components/Feature/ExploreCreators/Hero";
import Footer from "@/components/Layout/Footer";
import ExploreCreators from "@/components/Feature/ExploreCreators/Creators";
import { creators } from "@/utils/dummyData/creatorsData";
import { DEFAULT_SORT, SORT_OPTIONS, SortValue } from "@/utils/sortOptions";

export default function ExploreCreatorsPage() {
  const [sortBy, setSortBy] = useState<SortValue>(DEFAULT_SORT);
  const sortedCreators = useMemo(() => {
    const data = [...creators];

    switch (sortBy) {
      case SORT_OPTIONS[0].value:
        return data.sort((a, b) => a.name.localeCompare(b.name));
      case SORT_OPTIONS[1].value:
        return data.sort((a, b) => b.uploads - a.uploads);
      case SORT_OPTIONS[2].value:
        return data.sort((a, b) => b.createdAt - a.createdAt);
      default:
        return data;
    }
  }, [sortBy]);

  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Section>
          <ExploreCreatorsHero setSortBy={setSortBy} />
          <ExploreCreators creators={sortedCreators} />
        </Section>
      </Main>
      <Footer />
    </PageContainer>
  );
}
