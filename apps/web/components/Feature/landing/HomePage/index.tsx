"use client";

import { useTranslation } from "react-i18next";

import HeroSection from "@/components/Feature/landing/Hero";
import InterestSection from "@/components/Feature/landing/InterestSection";
import DiscoverContent from "@/components/Feature/landing/DiscoverContent";
import ExploreCategories from "@/components/Feature/landing/ExploreCategories";
import SecurePaymentSection from "@/components/Feature/landing/SecurePayment";
import TestimonialSection from "@/components/Feature/landing/Testimonial";
import ExploreCreatorsMarquee from "@/components/Feature/landing/ExploreCreatorsMarquee";
import CallToAction from "@/components/Feature/landing/CallToAction";
import CtaSection from "@/components/Feature/CtaSection";
import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import ctaImage from "@/assets/images/cta-buttom.webp";
import { Main, PageContainer } from "@/app/styles";
import WatchingSteps from "../WatchingSteps";

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

        <ExploreCategories />

        <SecurePaymentSection />

        <TestimonialSection />

        <ExploreCreatorsMarquee />

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
