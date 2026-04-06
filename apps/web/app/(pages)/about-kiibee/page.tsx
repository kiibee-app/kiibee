"use client";

import React from "react";
import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main, Section } from "../../styles";
import AboutHero from "@/components/Feature/AboutKiibee/Hero";

export default function AboutKiibeePage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Section>
          <AboutHero />
        </Section>
      </Main>
    </PageContainer>
  );
}
