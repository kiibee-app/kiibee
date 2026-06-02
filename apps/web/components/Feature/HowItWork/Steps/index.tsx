"use client";

import React from "react";
import Image from "@/components/UI/SafeImage";
import {
  StepsSection,
  Inner,
  Heading,
  Subtitle,
  Grid,
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
import ScrollReveal from "@/components/UI/ScrollReveal";
import { LANDING_REVEAL } from "@/utils/landingUtils";

export default function HowSteps() {
  const { t } = useTranslation();
  const items = howItWorksSteps;

  return (
    <StepsSection>
      <Inner>
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

        <Grid>
          {items.map((it, i) => (
            <ScrollReveal
              key={it.id}
              delay={LANDING_REVEAL.shortDelay * (i + 1)}
            >
              <Card>
                <ImgWrap>
                  <Image
                    src={it.img}
                    alt={t(it.titleKey)}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
                    priority
                  />
                </ImgWrap>
                <CardTitle>
                  <MonoText $use="Heading3">{t(it.titleKey)}</MonoText>
                </CardTitle>
                <CardText>
                  <MonoText $use="H5_Regular">{t(it.textKey)}</MonoText>
                </CardText>
              </Card>
            </ScrollReveal>
          ))}
        </Grid>
      </Inner>
    </StepsSection>
  );
}
