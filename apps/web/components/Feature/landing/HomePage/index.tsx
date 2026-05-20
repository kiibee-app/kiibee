"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";

import HeroSection from "@/components/Feature/landing/Hero";
import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import GenericLoader from "@/components/UI/GenericLoader";
import ctaImage from "@/assets/images/cta-buttom.webp";
import { LOADER_SIZE, LOADER_VARIANT } from "@/utils/ui";
import { Main, PageContainer } from "@/app/styles";

function SectionLoader() {
  return (
    <GenericLoader
      variant={LOADER_VARIANT.INLINE}
      size={LOADER_SIZE.SM}
      label="Loading"
    />
  );
}

const withLoader = <TProps,>(
  importFn: () => Promise<{ default: ComponentType<TProps> }>,
) =>
  dynamic<TProps>(importFn, {
    loading: () => <SectionLoader />,
  });

const sections = {
  InterestSection: withLoader(
    () => import("@/components/Feature/landing/InterestSection"),
  ),
  DiscoverContent: withLoader(
    () => import("@/components/Feature/landing/DiscoverContent"),
  ),
  WatchingSteps: withLoader(
    () => import("@/components/Feature/landing/WatchingSteps"),
  ),
  SecurePaymentSection: withLoader(
    () => import("@/components/Feature/landing/SecurePayment"),
  ),
  TestimonialSection: withLoader(
    () => import("@/components/Feature/landing/Testimonial"),
  ),
  CallToAction: withLoader(
    () => import("@/components/Feature/landing/CallToAction"),
  ),
  CtaSection: withLoader(() => import("@/components/Feature/CtaSection")),
};

export default function HomePageClient() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <NavBar />

      <Main>
        <HeroSection />

        <sections.InterestSection />

        <sections.DiscoverContent />

        <sections.WatchingSteps />

        <sections.SecurePaymentSection />

        <sections.TestimonialSection />

        <sections.CallToAction />

        <sections.CtaSection
          bgImage={ctaImage}
          title={t("value.title")}
          subtitle={t("value.subtitle")}
          ctaText={t("value.cta")}
        />
      </Main>

      <Footer />
    </PageContainer>
  );
}
