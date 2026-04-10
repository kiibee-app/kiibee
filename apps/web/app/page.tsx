"use client";

import HeroSection from "@/components/Feature/landing/Hero";
import TestimonialSection from "@/components/Feature/landing/Testimonial";
import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main } from "./styles";
import CtaSection from "@/components/Feature/CtaSection";
import Footer from "@/components/Layout/Footer";
import WatchingSteps from "@/components/Feature/landing/WatchingSteps";
import CallToAction from "@/components/Feature/landing/CallToAction";
import SecurePaymentSection from "@/components/Feature/landing/SecurePayment";
import InterestSection from "@/components/Feature/landing/InterestSection";
import DiscoverContent from "@/components/Feature/landing/DiscoverContent";
import ctaImage from "@/assets/images/cta-buttom.png";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <NavBar />
      <Main>
        <HeroSection />
        <InterestSection />
        <DiscoverContent />
        <WatchingSteps />
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
