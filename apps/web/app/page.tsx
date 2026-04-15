"use client";

import dynamic from "next/dynamic";
import HeroSection from "@/components/Feature/landing/Hero";
import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main } from "./styles";
import LazySection from "@/components/UI/LazySection";
import GenericLoader from "@/components/UI/GenericLoader";
import ctaImage from "@/assets/images/cta-buttom.png";
import { LOADER_SIZE, LOADER_VARIANT } from "@/utils/ui";
import { useTranslation } from "react-i18next";
import Footer from "@/components/Layout/Footer";

const InterestSection = dynamic(
  () => import("@/components/Feature/landing/InterestSection"),
  { loading: () => <SectionLoader /> },
);
const DiscoverContent = dynamic(
  () => import("@/components/Feature/landing/DiscoverContent"),
  { loading: () => <SectionLoader /> },
);
const WatchingSteps = dynamic(
  () => import("@/components/Feature/landing/WatchingSteps"),
  { loading: () => <SectionLoader /> },
);
const SecurePaymentSection = dynamic(
  () => import("@/components/Feature/landing/SecurePayment"),
  { loading: () => <SectionLoader /> },
);
const TestimonialSection = dynamic(
  () => import("@/components/Feature/landing/Testimonial"),
  { loading: () => <SectionLoader /> },
);
const CallToAction = dynamic(
  () => import("@/components/Feature/landing/CallToAction"),
  { loading: () => <SectionLoader /> },
);
const CtaSection = dynamic(() => import("@/components/Feature/CtaSection"), {
  loading: () => <SectionLoader />,
});

function SectionLoader() {
  return (
    <GenericLoader
      variant={LOADER_VARIANT.INLINE}
      size={LOADER_SIZE.SM}
      label="Loading"
    />
  );
}

export default function Home() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <NavBar />
      <Main>
        <HeroSection />
        <LazySection minHeight={360}>
          <InterestSection />
        </LazySection>
        <LazySection minHeight={520}>
          <DiscoverContent />
        </LazySection>
        <LazySection minHeight={520}>
          <WatchingSteps />
        </LazySection>
        <LazySection minHeight={520}>
          <SecurePaymentSection />
        </LazySection>
        <LazySection minHeight={520}>
          <TestimonialSection />
        </LazySection>
        <LazySection minHeight={520}>
          <CallToAction />
        </LazySection>
        <LazySection minHeight={420}>
          <CtaSection
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
