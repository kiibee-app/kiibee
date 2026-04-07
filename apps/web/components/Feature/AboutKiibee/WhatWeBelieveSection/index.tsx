"use client";

import React from "react";
import Image from "next/image";
import {
  SectionWrapper,
  Container,
  Grid,
  Title,
  Text,
  ImageWrapper,
  Inner,
} from "./styles";

import beliefImg from "../../../../assets/images/believe.png";
import { useTranslation } from "react-i18next";

export default function WhatWeBelieveSection() {
  const { t } = useTranslation();

  return (
    <SectionWrapper>
      <Inner>
        <Container>
          <Grid>
            <ImageWrapper>
              <Image
                src={beliefImg}
                alt={t("about.believe.alt")}
                fill
                loading="eager"
                style={{ objectFit: "cover" }}
              />
            </ImageWrapper>

            <div>
              <Title>{t("about.believe.title")}</Title>

              <Text>{t("about.believe.content.quality")}</Text>
              <Text>{t("about.believe.content.creators")}</Text>
              <Text>{t("about.believe.content.viewers")}</Text>
            </div>
          </Grid>
        </Container>
      </Inner>
    </SectionWrapper>
  );
}
