"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import creatorMainImage from "../../../assets/images/creators/creator-woman-orange.jpg";
import creatorSideImageOne from "../../../assets/images/creators/creator-man-podcast.jpg";
import creatorSideImageTwo from "../../../assets/images/creators/creator-woman-gray-jacket.jpg";
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
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const cards = [
    {
      image: creatorMainImage.src,
      alt: t("creators.mainCard.alt"),
      title: t("creators.mainCard.title"),
      subtitle: t("creators.mainCard.subtitle"),
      narrowBgPosition: "-360px -1.138px",
      narrowBgSize: "320% 100.235%",
    },
    {
      image: creatorSideImageOne.src,
      alt: t("creators.salesInsights.alt"),
      title: t("creators.salesInsights.title"),
      subtitle: "",
      narrowBgPosition: "-622.927px -28.838px",
      narrowBgSize: "661.917% 106.472%",
    },
    {
      image: creatorSideImageTwo.src,
      alt: t("creators.paymentSolutions.alt"),
      title: t("creators.paymentSolutions.title"),
      subtitle: "",
      narrowBgPosition: "-192.28px -0.516px",
      narrowBgSize: "321.398% 125.046%",
    },
  ];

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

        <RightColumn onMouseLeave={() => setActiveCardIndex(0)}>
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
                onMouseEnter={() => setActiveCardIndex(index)}
                initial={false}
                animate={{
                  width: isActive ? 498 : 154,
                  paddingTop: isActive ? 34 : 26,
                  paddingRight: isActive ? 54 : 0,
                  paddingBottom: 26,
                  paddingLeft: isActive ? 20 : 0,
                }}
                transition={{
                  width: {
                    type: "spring",
                    stiffness: 220,
                    damping: 28,
                    mass: 0.7,
                  },
                  paddingTop: {
                    type: "spring",
                    stiffness: 220,
                    damping: 28,
                    mass: 0.7,
                  },
                  paddingRight: {
                    type: "spring",
                    stiffness: 220,
                    damping: 28,
                    mass: 0.7,
                  },
                  paddingLeft: {
                    type: "spring",
                    stiffness: 220,
                    damping: 28,
                    mass: 0.7,
                  },
                  paddingBottom: {
                    type: "spring",
                    stiffness: 220,
                    damping: 28,
                    mass: 0.7,
                  },
                }}
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
