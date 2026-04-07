"use client";

import React from "react";
import NavBar from "@/components/Layout/Navbar";
import AboutHero from "@/components/Feature/AboutKiibee/Hero";
import AboutStorySection from "@/components/Feature/AboutKiibee/AboutStorySection";
import { Main, PageContainer, Section } from "@/app/styles";
import WhatWeBelieveSection from "@/components/Feature/AboutKiibee/WhatWeBelieveSection";
import MoreThanPlatformSection from "@/components/Feature/AboutKiibee/MorePlatform";
import ValueStatement from "@/components/Feature/landing/ValueStatement";
import Footer from "@/components/Layout/Footer";
import valueBg from "../../../assets/images/cta-buttom1.png";
import { useTranslation } from "react-i18next";

export default function AboutKiibeePage() {
  const { t } = useTranslation();

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
      <ValueStatement
        bgImage={valueBg}
        title={t("about.value.title")}
        subtitle={t("about.value.subtitle")}
      />

      <Footer />
    </PageContainer>
  );
}
