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
  getRevealCardStyle,
  callToActionCardStyle,
} from "./styles";
import { desktopCards, mobileCards } from "@/utils/cards";
import { MonoText } from "@/components/UI/Monotext";
import SafeImage from "@/components/UI/SafeImage";
import COLORS from "@repo/ui/colors";
import { resolveImageUrl } from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import ScrollReveal from "@/components/UI/ScrollReveal";
import ImageReveal from "@/components/UI/ImageReveal";
import { LANDING_REVEAL } from "@/utils/landingUtils";
import { type CtaImageCard } from "@/types/landingCallToAction";
import { LANDING_REVEAL_VARIANTS } from "@/utils/landingUtils";

export default function CallToAction() {
  const { t } = useTranslation();

  const renderCard = (card: CtaImageCard, index: number, mobile = false) => (
    <ImageReveal
      key={`reveal-${card.src}-${mobile ? "mobile" : "desktop"}-${index}`}
      variant={LANDING_REVEAL_VARIANTS.fadeScale}
      delay={index * LANDING_REVEAL.ctaCardStaggerDelay}
      duration={LANDING_REVEAL.revealDuration}
      style={getRevealCardStyle(card, mobile)}
    >
      <Card
        key={`${card.src}-${mobile ? "mobile" : "desktop"}-${index}`}
        $left={!mobile ? card.left : undefined}
        $top={!mobile ? card.top : undefined}
        $width={!mobile ? card.width : undefined}
        $height={!mobile ? card.height : undefined}
        $mobileOnly={mobile}
        style={callToActionCardStyle}
      >
        <CardImage
          src={resolveImageUrl(card.src)}
          alt={t("callToAction.creatorAlt")}
        />
        <CardTint />
      </Card>
    </ImageReveal>
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
        <ScrollReveal>
          <Heading>
            <MonoText $use="Heading1" color={COLORS.primary.WHITE}>
              {t("callToAction.title")}
            </MonoText>
          </Heading>
        </ScrollReveal>
        <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
          <Subtitle>
            <MonoText $use="Body_Medium" color={COLORS.primary.WHITE}>
              {t("callToAction.subtitle")}
            </MonoText>
          </Subtitle>
        </ScrollReveal>
        <CTAButton asAnchor href={PATHS.AUTH_SIGNUP}>
          {t("callToAction.cta")}
        </CTAButton>
      </Content>
    </Section>
  );
}
