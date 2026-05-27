"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { SectionWrapper, Grid, Title, Text, Inner, Container } from "./styles";
import { leftTexts, rightTexts } from "@/utils/ourStory";
import { MonoText } from "@/components/UI/Monotext";
import ScrollReveal from "@/components/UI/ScrollReveal";
import { LANDING_REVEAL } from "@/utils/landingUtils";

export default function OurStorySection() {
  const { t } = useTranslation();

  return (
    <SectionWrapper>
      <Inner>
        <Container>
          <ScrollReveal>
            <Title>
              <MonoText $use="Heading1">{t("about.ourStory.title")}</MonoText>
            </Title>
          </ScrollReveal>

          <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
            <Grid>
              <div>
                {leftTexts.map((key, index) => (
                  <Text key={key} $isLast={index === leftTexts.length - 2}>
                    {t(key)}
                  </Text>
                ))}
              </div>

              <div>
                {rightTexts.map((key) => (
                  <Text key={key}>{t(key)}</Text>
                ))}
              </div>
            </Grid>
          </ScrollReveal>
        </Container>
      </Inner>
    </SectionWrapper>
  );
}
