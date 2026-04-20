"use client";

import HeroSection from "@/components/Feature/landing/Hero";
import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main } from "./styles";
import Footer from "@/components/Layout/Footer";
import ctaImage from "@/assets/images/cta-buttom.webp";
import { useTranslation } from "react-i18next";
import LazySection from "@/components/UI/LazySection";
import dynamic from "next/dynamic";
import { LOADER_SIZE, LOADER_VARIANT } from "@/utils/ui";
import GenericLoader from "@/components/UI/GenericLoader";
import type { ComponentType } from "react";

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

export default function Home() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <NavBar />

      <Main>
        <HeroSection />

        <LazySection minHeight={360}>
          <sections.InterestSection />
        </LazySection>

        <LazySection minHeight={520}>
          <sections.DiscoverContent />
        </LazySection>

        <LazySection minHeight={520}>
          <sections.WatchingSteps />
        </LazySection>

        <LazySection minHeight={520}>
          <sections.SecurePaymentSection />
        </LazySection>

        <LazySection minHeight={520}>
          <sections.TestimonialSection />
        </LazySection>

        <LazySection minHeight={520}>
          <sections.CallToAction />
        </LazySection>

        <LazySection minHeight={420}>
          <sections.CtaSection
            bgImage={ctaImage}
            title={t("value.title")}
            subtitle={t("value.subtitle")}
            ctaText={t("value.cta")}
          />
        </LazySection>
      </Main>

      <Footer />
    </PageContainer>
  );
}
