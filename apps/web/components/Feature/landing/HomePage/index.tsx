"use client";

import { useTranslation } from "react-i18next";

import HeroSection from "@/components/Feature/landing/Hero";
import InterestSection from "@/components/Feature/landing/InterestSection";
import DiscoverContent from "@/components/Feature/landing/DiscoverContent";
import WatchingSteps from "@/components/Feature/landing/WatchingSteps";
import ExploreCreatorsMarquee from "@/components/Feature/landing/ExploreCreatorsMarquee";
import SecurePaymentSection from "@/components/Feature/landing/SecurePayment";
import TestimonialSection from "@/components/Feature/landing/Testimonial";
import CallToAction from "@/components/Feature/landing/CallToAction";
import CtaSection from "@/components/Feature/CtaSection";
import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import ctaImage from "@/assets/images/cta-buttom.webp";
import { Main, PageContainer } from "@/app/styles";

export default function HomePageClient() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <NavBar />

      <Main>
        <HeroSection />

        <InterestSection />

        <DiscoverContent />

        <WatchingSteps />

        <ExploreCreatorsMarquee />

        <SecurePaymentSection />

        <TestimonialSection />

        <CallToAction />

        <CtaSection
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
