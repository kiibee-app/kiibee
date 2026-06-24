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
import { useAboutNavTone } from "@/hooks/useAboutNavTone";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { PATHS } from "@/utils/path";

export default function AboutKiibeePage() {
  const { t } = useTranslation();
  const { darkSectionRef, navTextTone } = useAboutNavTone();
  const user = useStoredLoginUser();
  const isLoggedIn = !!user;

  return (
    <PageContainer>
      <NavBar navTextTone={navTextTone} />
      <Main>
        <Section>
          <AboutHero />
          <AboutStorySection />
          <WhatWeBelieveSection />
          <div ref={darkSectionRef}>
            <MoreThanPlatformSection />
          </div>
        </Section>
      </Main>
      <CtaSection
        bgImage={ctaImage}
        title={t("about.value.title")}
        subtitle={t("about.value.subtitle")}
        ctaText={isLoggedIn ? t("how.cta") : t("about.value.cta")}
        ctaHref={isLoggedIn ? PATHS.EXPLORE : PATHS.AUTH_SIGNUP}
      />

      <Footer />
    </PageContainer>
  );
}
