"use client";

import React, { useRef } from "react";
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
  CARD_IMAGE_RATIOS,
} from "./styles";
import { useTranslation } from "react-i18next";
import { NAV } from "@/utils/translationKeys";
import { howItWorksSteps } from "@/utils/steps";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import ScrollReveal from "@/components/UI/ScrollReveal";
import { LANDING_REVEAL } from "@/utils/landingUtils";
import { useStepsParallax } from "@/hooks/useStepsParallax";

export default function HowSteps() {
  const { t } = useTranslation();
  const items = howItWorksSteps;
  const sectionRef = useRef<HTMLElement | null>(null);

  useStepsParallax(sectionRef, items.length);

  return (
    <StepsSection ref={sectionRef}>
      <Inner>
        <HeaderGroup>
          <ScrollReveal>
            <Heading>
              <MonoText $use="Heading2">{t(NAV.howItWorks)}</MonoText>
            </Heading>
          </ScrollReveal>

          <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
            <Subtitle>
              <MonoText $use="H4_Medium" color={COLORS.neutral.GRAY_700}>
                {t("how.stepsSubtitle")}
              </MonoText>
            </Subtitle>
          </ScrollReveal>
        </HeaderGroup>

        <Grid>
          {items.map((it, i) => (
            <GridItem key={it.id}>
              <ScrollReveal
                delay={LANDING_REVEAL.shortDelay * (i + 1)}
                style={{ width: "100%" }}
              >
                <Card $index={i} data-step-parallax>
                  <ImgWrap $ratio={CARD_IMAGE_RATIOS[i]}>
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
              </ScrollReveal>
            </GridItem>
          ))}
        </Grid>
      </Inner>
    </StepsSection>
  );
}
