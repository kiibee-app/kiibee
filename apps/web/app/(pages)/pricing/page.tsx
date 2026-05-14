"use client";

import Footer from "@/components/Layout/Footer";
import FaqSection from "@/components/Feature/Pricing/FaqSection";
import CtaSection from "@/components/Feature/CtaSection";
import PricingPlansSection from "@/components/Feature/Pricing/PlansSection";
import NavBar from "@/components/Layout/Navbar";
import { Main, PageContainer } from "@/app/styles";
import pricingHeroImage from "@/assets/images/pricing/pricing-hero.webp";
import ctaImage from "@/assets/images/cta-buttom1.webp";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import {
  Container,
  Content,
  Description,
  Hero,
  Overlay,
  PrimaryButton,
  Title,
} from "./styles";
import { PATHS } from "@/utils/path";

export default function PricingPage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Hero $backgroundImage={pricingHeroImage.src}>
          <Overlay />
          <Container>
            <Content>
              <Title>{t("pricingPage.title")}</Title>
              <Description>
                {t("pricingPage.descriptionLine1")}
                <br />
                {t("pricingPage.descriptionLine2")}
              </Description>
              <PrimaryButton
                type="button"
                onClick={() => router.push(PATHS.AUTH_SIGNUP_CREATOR)}
              >
                {t("pricingPage.cta")}
              </PrimaryButton>
            </Content>
          </Container>
        </Hero>
        <PricingPlansSection />
        <FaqSection />
        <CtaSection
          bgImage={ctaImage}
          title={t("startCreating.heading")}
          subtitleLines={[
            t("startCreating.description1"),
            t("startCreating.description2"),
          ]}
          ctaText={t("startCreating.cta")}
          ctaHref={PATHS.AUTH_SIGNUP_CREATOR}
        />
      </Main>
      <Footer />
    </PageContainer>
  );
}
