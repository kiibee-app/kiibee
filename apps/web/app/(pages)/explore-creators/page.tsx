"use client";

import React from "react";
import NavBar from "@/components/Layout/Navbar";
import { Main, PageContainer, Section } from "@/app/styles";
import ExploreCreatorsHero from "@/components/Feature/ExploreCreators/Hero";
import Footer from "@/components/Layout/Footer";

export default function ExploreCreatorsPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Section>
          <ExploreCreatorsHero />
        </Section>
      </Main>
      <Footer />
    </PageContainer>
  );
}
