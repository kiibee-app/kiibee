"use client";

import { useTranslation } from "react-i18next";
import kiibeeLogo from "@/assets/images/kiibee-logo.svg";
import {
  Section,
  Backdrop,
  Card,
  CardImage,
  CardTint,
  MobileBackdrop,
  MobileGrid,
  GradientOverlay,
  VignetteOverlay,
  Content,
  Brand,
  BrandLogo,
  Heading,
  Subtitle,
  CTAButton,
} from "./styles";
import { desktopCards, mobileCards } from "@/utils/cards";

export default function CallToAction() {
  const { t } = useTranslation();

  return (
    <Section>
      <Backdrop>
        {desktopCards.map((card, index) => (
          <Card
            key={`${card.src}-${index}`}
            $left={card.left}
            $top={card.top}
            $width={card.width}
            $height={card.height}
          >
            <CardImage src={card.src} alt={t("callToAction.creatorAlt")} />
            <CardTint />
          </Card>
        ))}
      </Backdrop>

      <MobileBackdrop>
        <MobileGrid>
          {mobileCards.map((src, index) => (
            <Card key={`${src}-mobile-${index}`} $mobileOnly>
              <CardImage src={src} alt={t("callToAction.creatorAlt")} />
              <CardTint />
            </Card>
          ))}
        </MobileGrid>
      </MobileBackdrop>

      <GradientOverlay />
      <VignetteOverlay />

      <Content>
        <Brand>
          <BrandLogo>
            <img
              src={kiibeeLogo.src ?? kiibeeLogo}
              alt={t("callToAction.logoAlt")}
            />
          </BrandLogo>
        </Brand>
        <Heading>
          {t("callToAction.titleLine1")}
          <br />
          {t("callToAction.titleLine2")}
        </Heading>
        <Subtitle>{t("callToAction.subtitle")}</Subtitle>
        <CTAButton type="button">{t("callToAction.cta")}</CTAButton>
      </Content>
    </Section>
  );
}
