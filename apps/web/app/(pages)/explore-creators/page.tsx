"use client";

import React from "react";
import NavBar from "@/components/Layout/Navbar";
import { Main, PageContainer, Section } from "@/app/styles";
import ExploreCreatorsHero from "@/components/Feature/ExploreCreators/Hero";
import ExploreCreators from "@/components/Feature/ExploreCreators/Creators";
import Footer from "@/components/Layout/Footer";

export default function ExploreCreatorsPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Section>
          <ExploreCreatorsHero />
          <ExploreCreators />
        </Section>
      </Main>
      <Footer />
    </PageContainer>
  );
}
