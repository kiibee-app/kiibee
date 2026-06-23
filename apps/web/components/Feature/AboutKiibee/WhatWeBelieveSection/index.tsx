"use client";

import React from "react";
import Image from "@/components/UI/SafeImage";
import {
  SectionWrapper,
  Container,
  Grid,
  Title,
  Text,
  ImageWrapper,
  Inner,
  beliefRevealStyle,
  beliefImageStyle,
} from "./styles";

import beliefImg from "@/assets/images/believe.webp";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import ScrollReveal from "@/components/UI/ScrollReveal";
import ImageReveal from "@/components/UI/ImageReveal";
import { LANDING_REVEAL, LANDING_REVEAL_VARIANTS } from "@/utils/landingUtils";

export default function WhatWeBelieveSection() {
  const { t } = useTranslation();

  return (
    <SectionWrapper>
      <Inner>
        <Container>
          <Grid>
            <ImageWrapper>
              <ImageReveal
                variant={LANDING_REVEAL_VARIANTS.slideUp}
                duration={LANDING_REVEAL.longRevealDuration}
                style={beliefRevealStyle}
              >
                <Image
                  src={beliefImg}
                  alt={t("about.believe.alt")}
                  fill
                  loading="eager"
                  sizes="(max-width: 767px) 100vw, 50vw"
                  style={beliefImageStyle}
                />
              </ImageReveal>
            </ImageWrapper>

            <div>
              <ScrollReveal>
                <Title>
                  <MonoText $use="Heading2">
                    {t("about.believe.title")}
                  </MonoText>
                </Title>
              </ScrollReveal>
              <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
                <Text>{t("about.believe.content.quality")}</Text>
              </ScrollReveal>
              <ScrollReveal delay={LANDING_REVEAL.shortDelay * 2}>
                <Text>{t("about.believe.content.creators")}</Text>
              </ScrollReveal>
              <ScrollReveal delay={LANDING_REVEAL.shortDelay * 3}>
                <Text>{t("about.believe.content.viewers")}</Text>
              </ScrollReveal>
            </div>
          </Grid>
        </Container>
      </Inner>
    </SectionWrapper>
  );
}
