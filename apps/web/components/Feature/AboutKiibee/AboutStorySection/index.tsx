"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { SectionWrapper, Grid, Title, Text, Inner, Container } from "./styles";

export default function OurStorySection() {
  const { t } = useTranslation();

  return (
    <SectionWrapper>
      <Inner>
        <Container>
          <Title>{t("about.ourStory.title")}</Title>

          <Grid>
            <div>
              <Text>{t("about.ourStory.left.intro")}</Text>
              <Text>{t("about.ourStory.left.marketGap")}</Text>
              <Text>
                {t("about.ourStory.left.consumerNeed")}
                <br />
                {t("about.ourStory.left.bridge")}
              </Text>
            </div>

            <div>
              <Text>{t("about.ourStory.right.mission")}</Text>
              <Text>{t("about.ourStory.right.evolution")}</Text>
            </div>
          </Grid>
        </Container>
      </Inner>
    </SectionWrapper>
  );
}
