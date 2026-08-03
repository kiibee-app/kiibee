"use client";

import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import ScrollReveal from "@/components/UI/ScrollReveal";
import COLORS from "@repo/ui/colors";
import {
  SectionWrapper,
  Inner,
  Container,
  MeaningBox,
  Title,
  Body,
  BrandHighlight,
} from "./styles";

export default function KiibeeMeaningSection() {
  const { t } = useTranslation();

  return (
    <SectionWrapper>
      <Inner>
        <Container>
          <ScrollReveal>
            <MeaningBox>
              <Title>
                <MonoText $use="Heading3" color={COLORS.primary.GREEN_100}>
                  {t("about.kiibeeMeaning.title")}
                </MonoText>
              </Title>
              <Body>
                <Trans
                  i18nKey="about.kiibeeMeaning.body"
                  components={{ brand: <BrandHighlight /> }}
                />
              </Body>
            </MeaningBox>
          </ScrollReveal>
        </Container>
      </Inner>
    </SectionWrapper>
  );
}
