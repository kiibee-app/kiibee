"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/utils/useIsMobile";
import { getCreatorCards } from "@/utils/creatorCardData";
import {
  getCardDimensions,
  createCardTransition,
  getCardAnimation,
} from "@/utils/creatorAnimations";
import { useCreatorCards } from "@/utils/useCreatorCards";
import {
  Section,
  Container,
  LeftColumn,
  Heading,
  CTAButton,
  RightColumn,
  AnimatedCard,
  MainGradientOverlay,
  NarrowGradientOverlay,
  MainCardTextContainer,
  MainCardTitle,
  MainCardSubtitle,
  NarrowCardText,
} from "./style";

export default function CreatorsSection() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const cards = getCreatorCards(t);
  const {
    activeCardIndex,
    handleMouseEnter,
    handleMouseLeave,
    handleCardClick,
  } = useCreatorCards(isMobile);
  const { activeWidth, inactiveWidth, activePadding, inactivePadding } =
    getCardDimensions(isMobile);
  const cardTransition = createCardTransition();

  return (
    <Section>
      <Container>
        <LeftColumn>
          <Heading>
            {t("creators.heading.lineOne")}
            <br />
            {t("creators.heading.lineTwo")}
            <br />
            {t("creators.heading.lineThree")}
          </Heading>
          <CTAButton type="button">{t("creators.cta")}</CTAButton>
        </LeftColumn>

        <RightColumn onMouseLeave={handleMouseLeave}>
          {cards.map((card, index) => {
            const isActive = activeCardIndex === index;

            return (
              <AnimatedCard
                key={card.title}
                as={motion.div}
                $isActive={isActive}
                $image={card.image}
                $narrowBgPosition={card.narrowBgPosition}
                $narrowBgSize={card.narrowBgSize}
                aria-label={card.alt}
                onMouseEnter={() => handleMouseEnter(index)}
                onClick={() => handleCardClick(index)}
                onTouchStart={() => handleCardClick(index)}
                initial={false}
                animate={getCardAnimation(isActive, {
                  activeWidth,
                  inactiveWidth,
                  activePadding,
                  inactivePadding,
                })}
                transition={cardTransition}
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
