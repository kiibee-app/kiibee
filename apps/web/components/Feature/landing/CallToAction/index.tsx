"use client";

import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
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

/** Only clear animation props — never wipe layout (left/top/width/height). */
const CTA_CLEAR_PROPS = "opacity,visibility,transform";

export default function CallToAction() {
  const { t } = useTranslation();
  const user = useStoredLoginUser();
  const isLoggedIn = !!user;
  const sectionRef = useRef<HTMLDivElement>(null);

  const renderCard = (card: CtaImageCard, index: number, mobile = false) => (
    <Card
      key={`${CTA_CARD.keyPrefix}${resolveImageUrl(card.src)}-${mobile ? CTA_CARD.mobileLabel : CTA_CARD.desktopLabel}-${index}`}
      {...{ [CTA_CARD.attr]: STRING_EMPTY }}
      $left={!mobile ? card.left : undefined}
      $top={!mobile ? card.top : undefined}
      $width={!mobile ? card.width : undefined}
      $height={!mobile ? card.height : undefined}
      $mobileOnly={mobile}
    >
      <CardImage src={card.src} alt={t("callToAction.creatorAlt")} />
      <CardTint />
    </Card>
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll(CTA_CARD.selector),
      );
      if (cards.length === 0) return;
      gsap.set(cards, { autoAlpha: 1, scale: 1 });

      const mm = gsap.matchMedia();

      mm.add(LANDING_MOTION.reducedMotionQuery, () => {
        gsap.set(cards, { clearProps: CTA_CLEAR_PROPS });
      });

      mm.add(LANDING_MOTION.noReducedMotionQuery, () => {
        gsap.from(cards, {
          scale: 0.96,
          duration: LANDING_REVEAL.revealDuration,
          stagger: LANDING_REVEAL.ctaCardStaggerDelay,
          ease: LANDING_MOTION.easePower2Out,
          immediateRender: false,
          clearProps: CTA_CLEAR_PROPS,
          scrollTrigger: {
            trigger: section,
            start: LANDING_REVEAL.imageRevealStart,
            toggleActions: SCROLL_REVEAL.onceToggleActions,
            once: true,
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
        {!isLoggedIn && (
          <CTAButton asAnchor href={PATHS.AUTH_SIGNUP}>
            {t("callToAction.cta")}
          </CTAButton>
        )}
      </Content>
    </Section>
  );
}
