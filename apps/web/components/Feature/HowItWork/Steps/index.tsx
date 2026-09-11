"use client";

import React, { useEffect, useRef } from "react";
import Image from "@/components/UI/SafeImage";
import {
  StepsSection,
  Inner,
  HeaderGroup,
  Heading,
  Subtitle,
  Grid,
  GridItem,
  Card,
  ImgWrap,
  CardTitle,
  CardText,
} from "./styles";
import { useTranslation } from "react-i18next";
import { NAV } from "@/utils/translationKeys";
import { howItWorksSteps } from "@/utils/steps";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { useIsMobile } from "@/utils/useIsMobile";
import { useCreatorCards } from "@/utils/useCreatorCards";
import { getCardHeightState } from "@/utils/creatorAnimations";
import { useCreatorsGsap } from "@/components/Feature/ForCreator/CreatorsSection/useCreatorsGsap";

export default function HowSteps() {
  const { t } = useTranslation();
  const items = howItWorksSteps;
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  const {
    activeCardIndex,
    setActiveCardIndex,
    handleMouseEnter,
    handleMouseLeave,
    handleCardClick,
  } = useCreatorCards(isMobile);

  useEffect(() => {
    setActiveCardIndex(2);
  }, [setActiveCardIndex]);

  useCreatorsGsap({
    sectionRef,
    cardRefs,
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        handleMouseLeave();
      }
    });

    observer.observe(section);

    return () => observer.disconnect();
  }, [handleMouseLeave]);

  return (
    <StepsSection ref={sectionRef}>
      <Inner>
        <HeaderGroup>
          <Heading data-creator-hero-line>
            <MonoText $use="Heading2">{t(NAV.howItWorks)}</MonoText>
          </Heading>

          <Subtitle data-creator-hero-animate>
            <MonoText $use="H4_Medium" color={COLORS.neutral.GRAY_700}>
              {t("how.stepsSubtitle")}
            </MonoText>
          </Subtitle>
        </HeaderGroup>

        <Grid>
          {items.map((it, i) => {
            const heightState = getCardHeightState(i, activeCardIndex);
            return (
              <GridItem key={it.id}>
                <Card
                  ref={(node) => {
                    cardRefs.current[i] = node;
                  }}
                  data-creator-card
                  onMouseEnter={() => handleMouseEnter(i)}
                  onClick={() => handleCardClick(i)}
                  onTouchStart={() => handleCardClick(i)}
                >
                  <ImgWrap $heightState={heightState}>
                    <Image
                      src={it.img}
                      alt={t(it.titleKey)}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 392px"
                      priority={i === 0}
                    />
                  </ImgWrap>
                  <CardTitle>
                    <MonoText $use="Heading3">{t(it.titleKey)}</MonoText>
                  </CardTitle>
                  <CardText>
                    <MonoText $use="Body_Medium">{t(it.textKey)}</MonoText>
                  </CardText>
                </Card>
              </GridItem>
            );
          })}
        </Grid>
      </Inner>
    </StepsSection>
  );
}
