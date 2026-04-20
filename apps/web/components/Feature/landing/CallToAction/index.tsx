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
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { resolveImageUrl } from "@/utils/Constants";
import Image from "next/image";

export default function CallToAction() {
  const { t } = useTranslation();

  return (
    <Section>
      <Backdrop>
        {desktopCards.map((card, index) => (
          <Card
            key={`${resolveImageUrl(card.src)}-${index}`}
            $left={card.left}
            $top={card.top}
            $width={card.width}
            $height={card.height}
          >
            <CardImage
              src={resolveImageUrl(card.src)}
              alt={t("callToAction.creatorAlt")}
            />
            <CardTint />
          </Card>
        ))}
      </Backdrop>

      <MobileBackdrop>
        <MobileGrid>
          {mobileCards.map((src, index) => (
            <Card key={`${resolveImageUrl(src)}-${index}`} $mobileOnly>
              <CardImage
                src={resolveImageUrl(src)}
                alt={t("callToAction.creatorAlt")}
              />
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
            <Image
              src={kiibeeLogo.src ?? kiibeeLogo}
              alt={t("callToAction.logoAlt")}
              width={kiibeeLogo.width}
              height={kiibeeLogo.height}
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </BrandLogo>
        </Brand>
        <Heading>
          <MonoText $use="Heading1" color={COLORS.primary.WHITE}>
            {t("callToAction.titleLine1")}
            {t("callToAction.titleLine2")}
          </MonoText>
        </Heading>
        <Subtitle>
          <MonoText $use="Body_Medium" color={COLORS.primary.WHITE}>
            {t("callToAction.subtitle")}
          </MonoText>
        </Subtitle>
        <CTAButton type="button">{t("callToAction.cta")}</CTAButton>
      </Content>
    </Section>
  );
}
