"use client";

import Footer from "@/components/Layout/Footer";
import FaqSection from "@/components/Feature/Pricing/FaqSection";
import CtaSection from "@/components/Feature/CtaSection";
import PricingPlansSection from "@/components/Feature/Pricing/PlansSection";
import NavBar from "@/components/Layout/Navbar";
import Image from "@/components/UI/SafeImage";
import ImageReveal from "@/components/UI/ImageReveal";
import ScrollReveal from "@/components/UI/ScrollReveal";
import { Main, PageContainer } from "@/app/styles";
import pricingHeroImage from "@/assets/images/pricing/pricing-hero.webp";
import ctaImage from "@/assets/images/cta-buttom1.webp";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import {
  Background,
  Container,
  Content,
  Description,
  Hero,
  Overlay,
  PrimaryButton,
  Title,
  heroImageStyle,
  heroRevealStyle,
} from "./styles";
import { PATHS } from "@/utils/path";
import {
  LANDING_IMAGE_FLAGS,
  LANDING_REVEAL,
  LANDING_REVEAL_VARIANTS,
} from "@/utils/landingUtils";
import { IMAGE_SIZES } from "@/utils/landingShared";

export default function PricingPage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Hero>
          <Background>
            <ImageReveal
              variant={LANDING_REVEAL_VARIANTS.kenBurns}
              delay={0}
              duration={LANDING_REVEAL.heroKenBurnsDuration}
              start={LANDING_REVEAL.heroStart}
              noClip
              style={heroRevealStyle}
            >
              <Image
                src={pricingHeroImage}
                alt={t("pricingPage.title")}
                fill={LANDING_IMAGE_FLAGS.fill}
                priority={LANDING_IMAGE_FLAGS.priority}
                sizes={IMAGE_SIZES.fullViewport}
                style={heroImageStyle}
              />
            </ImageReveal>
          </Background>
          <Overlay />
          <Container>
            <Content>
              <ScrollReveal>
                <Title>{t("pricingPage.title")}</Title>
              </ScrollReveal>
              <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
                <Description>
                  {t("pricingPage.descriptionLine1")}
                  <br />
                  {t("pricingPage.descriptionLine2")}
                </Description>
              </ScrollReveal>
              <ScrollReveal delay={LANDING_REVEAL.mediumDelay}>
                <PrimaryButton
                  type="button"
                  onClick={() => router.push(PATHS.AUTH_SIGNUP_CREATOR)}
                >
                  {t("pricingPage.cta")}
                </PrimaryButton>
              </ScrollReveal>
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
