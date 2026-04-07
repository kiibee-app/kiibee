"use client";

import React from "react";
import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main } from "../../styles";
import HowHero from "@/components/Feature/HowItWork/Hero";
import CustomerSection from "@/components/Feature/HowItWork/CustomerSection";
import HowSteps from "@/components/Feature/HowItWork/Steps";
import FeatureHighlights from "@/components/Feature/HowItWork/FeatureHighlights";
import GetStarted from "@/components/Feature/HowItWork/GetStarted";
import Footer from "@/components/Layout/Footer";

export default function HowItWorksPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <HowHero />
        <HowSteps />
        <CustomerSection />
        <FeatureHighlights />
        <GetStarted />
      </Main>
      <Footer />
    </PageContainer>
  );
}
