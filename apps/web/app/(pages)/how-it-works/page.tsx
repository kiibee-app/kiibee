"use client";

import React from "react";
import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main, Section } from "../../styles";
import HowHero from "@/components/HowItWork/Hero";
import HowSteps from "@/components/HowItWork/Steps";

export default function HowItWorksPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Section>
          <HowHero />
          <HowSteps />
        </Section>
      </Main>
    </PageContainer>
  );
}
