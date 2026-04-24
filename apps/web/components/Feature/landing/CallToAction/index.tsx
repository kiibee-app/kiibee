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
import { BUTTON, resolveImageUrl, type ImageSource } from "@/utils/Constants";
import Image from "next/image";

type CTAImageCard = {
  src: ImageSource;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
};

export default function CallToAction() {
  const { t } = useTranslation();

  const renderCard = (card: CTAImageCard, index: number, mobile = false) => (
    <Card
      key={`${card.src}-${mobile ? "mobile" : "desktop"}-${index}`}
      $left={!mobile ? card.left : undefined}
      $top={!mobile ? card.top : undefined}
      $width={!mobile ? card.width : undefined}
      $height={!mobile ? card.height : undefined}
      $mobileOnly={mobile}
    >
      <CardImage
        src={resolveImageUrl(card.src)}
        alt={t("callToAction.creatorAlt")}
      />
      <CardTint />
    </Card>
  );

  return (
    <Section>
      <Backdrop>
        {desktopCards.map((card, index) => renderCard(card, index))}
      </Backdrop>

      <MobileBackdrop>
        <MobileGrid>
          {mobileCards.map((src, index) => renderCard({ src }, index, true))}
        </MobileGrid>
      </MobileBackdrop>

      <GradientOverlay />
      <VignetteOverlay />

      <Content>
        <Brand>
          <BrandLogo>
            <Image
              src={resolveImageUrl(kiibeeLogo)}
              alt={t("callToAction.logoAlt")}
              width={126}
              height={40}
              priority
              style={{ width: "100%", height: "auto" }}
            />
          </BrandLogo>
        </Brand>
        <Heading>
          <MonoText $use="Heading1" color={COLORS.primary.WHITE}>
            {t("callToAction.title")}
          </MonoText>
        </Heading>
        <Subtitle>
          <MonoText $use="Body_Medium" color={COLORS.primary.WHITE}>
            {t("callToAction.subtitle")}
          </MonoText>
        </Subtitle>
        <CTAButton type={BUTTON}>{t("callToAction.cta")}</CTAButton>
      </Content>
    </Section>
  );
}
