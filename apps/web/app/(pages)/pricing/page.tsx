"use client";

import Footer from "@/components/Layout/Footer";
import NavBar from "@/components/Layout/Navbar";
import { Main, PageContainer } from "@/app/styles";
import pricingHeroImage from "@/assets/images/pricing/pricing-hero.jpg";
import { useTranslation } from "react-i18next";
import {
  Container,
  Content,
  Description,
  Hero,
  Overlay,
  PrimaryButton,
  Title,
} from "./styles";

export default function PricingPage() {
  const { t } = useTranslation();

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
              <PrimaryButton type="button">
                {t("pricingPage.cta")}
              </PrimaryButton>
            </Content>
          </Container>
        </Hero>
      </Main>
      <Footer />
    </PageContainer>
  );
}
