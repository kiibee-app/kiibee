"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { SectionWrapper, Grid, Title, Text, Inner, Container } from "./styles";
import { leftTexts, rightTexts } from "@/utils/ourStory";

export default function OurStorySection() {
  const { t } = useTranslation();

  return (
    <SectionWrapper>
      <Inner>
        <Container>
          <Title>{t("about.ourStory.title")}</Title>

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
        </Container>
      </Inner>
    </SectionWrapper>
  );
}
