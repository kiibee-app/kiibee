"use client";

import React from "react";
import NavBar from "@/components/Layout/Navbar";
import { Main, PageContainer, Section } from "@/app/styles";
import ExploreCreatorsHero from "@/components/Feature/ExploreCreators/Hero";
import RecentlyAdded from "@/components/Feature/ExploreCreators/RecentlyAdded";

export default function ExploreCreatorsPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Section>
          <ExploreCreatorsHero />
        </Section>
        <RecentlyAdded />
      </Main>
    </PageContainer>
  );
}
