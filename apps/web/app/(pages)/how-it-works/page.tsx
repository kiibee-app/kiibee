"use client";

import React from "react";
import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main, Section } from "../../styles";
import HowHero from "@/components/Feature/HowItWork/Hero";
import CustomerSection from "@/components/Feature/HowItWork/CustomerSection";
import HowSteps from "@/components/Feature/HowItWork/Steps";

export default function HowItWorksPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Section>
          <HowHero />
          <HowSteps />
          <CustomerSection />
        </Section>
      </Main>
    </PageContainer>
  );
}
