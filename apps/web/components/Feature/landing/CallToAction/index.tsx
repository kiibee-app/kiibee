"use client";

import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
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
import {
  CTA_CARD,
  registerGsapPlugins,
  resolveImageUrl,
  STRING_EMPTY,
} from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import ScrollReveal from "@/components/UI/ScrollReveal";
import {
  LANDING_REVEAL,
  LANDING_MOTION,
  SCROLL_REVEAL,
} from "@/utils/landingUtils";
import { type CtaImageCard } from "@/utils/landingShared";

registerGsapPlugins();

export default function CallToAction() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);

  const renderCard = (card: CtaImageCard, index: number, mobile = false) => (
    <div
      key={`${CTA_CARD.keyPrefix}${card.src}-${mobile ? CTA_CARD.mobileLabel : CTA_CARD.desktopLabel}-${index}`}
      {...{ [CTA_CARD.attr]: STRING_EMPTY }}
      style={getRevealCardStyle(card, mobile)}
    >
      <Card
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
    </div>
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll(CTA_CARD.selector),
      );
      if (cards.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(LANDING_MOTION.reducedMotionQuery, () => {
        gsap.set(cards, { clearProps: LANDING_MOTION.clearPropsAll });
      });

      mm.add(LANDING_MOTION.noReducedMotionQuery, () => {
        gsap.fromTo(cards, CTA_CARD.fromVars, {
          ...CTA_CARD.toVars,
          duration: LANDING_REVEAL.revealDuration,
          stagger: LANDING_REVEAL.ctaCardStaggerDelay,
          ease: LANDING_MOTION.easePower2Out,
          scrollTrigger: {
            trigger: section,
            start: LANDING_REVEAL.imageRevealStart,
            toggleActions: SCROLL_REVEAL.onceToggleActions,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section ref={sectionRef}>
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
