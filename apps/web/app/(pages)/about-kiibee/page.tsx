"use client";

import React from "react";
import NavBar from "@/components/Layout/Navbar";
import AboutHero from "@/components/Feature/AboutKiibee/Hero";
import AboutStorySection from "@/components/Feature/AboutKiibee/AboutStorySection";
import { Main, PageContainer, Section } from "@/app/styles";
import WhatWeBelieveSection from "@/components/Feature/AboutKiibee/WhatWeBelieveSection";
import MoreThanPlatformSection from "@/components/Feature/AboutKiibee/MorePlatform";
import CtaSection from "@/components/Feature/CtaSection";
import Footer from "@/components/Layout/Footer";
import ctaImage from "@/assets/images/cta-buttom1.webp";
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
      <CtaSection
        bgImage={ctaImage}
        title={t("about.value.title")}
        subtitle={t("about.value.subtitle")}
        ctaText={t("about.value.cta")}
        ctaHref="/auth/signup"
      />

      <Footer />
    </PageContainer>
  );
}
