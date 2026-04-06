"use client";

import React from "react";
import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main, Section } from "../../styles";
import AboutHero from "@/components/Feature/AboutKiibee/Hero";
import AboutStorySection from "@/components/Feature/AboutKiibee/AboutStorySection";

export default function AboutKiibeePage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Section>
          <AboutHero />
          <AboutStorySection />
        </Section>
      </Main>
    </PageContainer>
  );
}
