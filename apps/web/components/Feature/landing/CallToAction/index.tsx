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
import SafeImage from "@/components/UI/SafeImage";
import COLORS from "@repo/ui/colors";
import { resolveImageUrl, type ImageSource } from "@/utils/Constants";
import { PATHS } from "@/utils/path";

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
            <SafeImage src={kiibeeLogo} alt={t("callToAction.logoAlt")} />
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
        <CTAButton asAnchor href={PATHS.AUTH_SIGNUP}>
          {t("callToAction.cta")}
        </CTAButton>
      </Content>
    </Section>
  );
}
