"use client";

import { useCallback, useRef, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { CREATORS } from "@/utils/translationKeys";
import { useIsMobile } from "@/utils/useIsMobile";
import { getCreatorCards } from "@/utils/creatorCardData";
import { useCreatorCards } from "@/utils/useCreatorCards";
import { getCardHeightState } from "@/utils/creatorAnimations";
import { useCreatorsGsap } from "./useCreatorsGsap";
import {
  Section,
  Container,
  CopyBlock,
  Heading,
  HeadingLine,
  CTAButton,
  CardsRow,
  AnimatedCard,
  CardImage,
  CardContent,
  CardTitle,
  CardSubtitle,
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

  useCreatorsGsap({
    sectionRef,
    cardRefs,
  });

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
        <CopyBlock>
          <Heading>
            <HeadingLine data-creator-hero-line>
              {t(CREATORS.heading.title)}
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

        <CardsRow onMouseLeave={handleMouseLeave}>
          {cards.map((card, index) => {
            const heightState = getCardHeightState(index, activeCardIndex);
            const isActive = heightState === 3;

            return (
              <AnimatedCard
                key={card.title}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                data-creator-card
                $heightState={heightState}
                aria-label={card.alt}
                aria-pressed={isActive}
                role="button"
                tabIndex={0}
                onFocus={() => handleCardClick(index)}
                onKeyDown={(event) => handleCardKeyDown(event, index)}
                onMouseEnter={() => handleMouseEnter(index)}
                onClick={() => handleCardClick(index)}
                onTouchStart={() => handleCardClick(index)}
              >
                <CardImage
                  src={resolveImageUrl(card.image)}
                  alt={card.alt}
                  draggable={false}
                />
                <CardContent>
                  <CardTitle>{card.title}</CardTitle>
                  {card.subtitle && (
                    <CardSubtitle $visible={heightState !== 1}>
                      {card.subtitle}
                    </CardSubtitle>
                  )}
                </CardContent>
              </AnimatedCard>
            );
          })}
        </CardsRow>
      </Container>
    </Section>
  );
}
