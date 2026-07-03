"use client";

import { useCallback, useRef, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { CREATORS } from "@/utils/translationKeys";
import { useIsMobile } from "@/utils/useIsMobile";
import { getCreatorCards } from "@/utils/creatorCardData";
import { useCreatorCards } from "@/utils/useCreatorCards";
import { useCreatorsGsap } from "./useCreatorsGsap";
import {
  Section,
  Container,
  LeftColumn,
  CopyBlock,
  Heading,
  HeadingLine,
  CTAButton,
  RightColumn,
  AnimatedCard,
  MainGradientOverlay,
  NarrowGradientOverlay,
  MainCardTextContainer,
  MainCardTitle,
  MainCardSubtitle,
  NarrowCardText,
} from "./styles";
import { resolveImageUrl } from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import { useSessionDashboardPath } from "@/hooks/auth/useSessionDashboardPath";

export default function CreatorsSection() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cards = getCreatorCards(t);
  const dashboardPath = useSessionDashboardPath();
  const isLoggedIn = !!dashboardPath;
  const {
    activeCardIndex,
    handleMouseEnter,
    handleMouseLeave,
    handleCardClick,
  } = useCreatorCards(isMobile);

  const { animateCardLift } = useCreatorsGsap({
    sectionRef,
    cardRefs,
    activeCardIndex,
    isMobile,
  });

  const handleCardMouseEnter = useCallback(
    (index: number) => {
      handleMouseEnter(index);
      animateCardLift(index);
    },
    [animateCardLift, handleMouseEnter],
  );

  const handleCardsMouseLeave = useCallback(() => {
    handleMouseLeave();
    animateCardLift(null);
  }, [animateCardLift, handleMouseLeave]);

  const handleCardKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>, index: number) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      handleCardClick(index);
    },
    [handleCardClick],
  );

  return (
    <Section ref={sectionRef}>
      <Container>
        <LeftColumn>
          <CopyBlock>
            <Heading>
              <HeadingLine data-creator-hero-line>
                {t(CREATORS.heading.lineOne)}
              </HeadingLine>
              <HeadingLine data-creator-hero-line>
                {t(CREATORS.heading.lineTwo)}
              </HeadingLine>
              <HeadingLine data-creator-hero-line>
                {t(CREATORS.heading.lineThree)}
              </HeadingLine>
            </Heading>
            {!isLoggedIn && (
              <CTAButton
                asAnchor
                href={PATHS.AUTH_SIGNUP}
                data-creator-hero-animate
                data-creator-hero-cta
              >
                {t(CREATORS.cta)}
              </CTAButton>
            )}
          </CopyBlock>
        </LeftColumn>

        <RightColumn onMouseLeave={handleCardsMouseLeave}>
          {cards.map((card, index) => {
            const isActive = activeCardIndex === index;

            return (
              <AnimatedCard
                key={card.title}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                data-creator-card
                $isActive={isActive}
                $image={resolveImageUrl(card.image)}
                $narrowBgPosition={card.narrowBgPosition}
                $narrowBgSize={card.narrowBgSize}
                aria-label={card.alt}
                aria-pressed={isActive}
                role="button"
                tabIndex={0}
                onFocus={() => handleCardClick(index)}
                onKeyDown={(event) => handleCardKeyDown(event, index)}
                onMouseEnter={() => handleCardMouseEnter(index)}
                onClick={() => handleCardClick(index)}
                onTouchStart={() => handleCardClick(index)}
              >
                <MainGradientOverlay $visible={isActive} />
                <NarrowGradientOverlay $visible={!isActive} />
                <MainCardTextContainer $visible={isActive}>
                  <MainCardTitle>{card.title}</MainCardTitle>
                  {card.subtitle ? (
                    <MainCardSubtitle>{card.subtitle}</MainCardSubtitle>
                  ) : null}
                </MainCardTextContainer>
                <NarrowCardText $visible={!isActive}>
                  {card.title}
                </NarrowCardText>
              </AnimatedCard>
            );
          })}
        </RightColumn>
      </Container>
    </Section>
  );
}
