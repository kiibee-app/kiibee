"use client";

import React from "react";
import NavBar from "@/components/Layout/Navbar";
import AboutHero from "@/components/Feature/AboutKiibee/Hero";
import AboutStorySection from "@/components/Feature/AboutKiibee/AboutStorySection";
import { Main, PageContainer, Section } from "@/app/styles";
import WhatWeBelieveSection from "@/components/Feature/AboutKiibee/WhatWeBelieveSection";
import MoreThanPlatformSection from "@/components/Feature/AboutKiibee/MorePlatform";

export default function AboutKiibeePage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Section>
          <AboutHero />
          <AboutStorySection />
          <WhatWeBelieveSection />
          <MoreThanPlatformSection />
        </Section>
      </Main>
    </PageContainer>
  );
}
