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
import { MonoText } from "@/components/UI/Monotext";

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
                sizes="(max-width: 767px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </ImageWrapper>

            <div>
              <Title>
                <MonoText $use="Heading2">{t("about.believe.title")}</MonoText>
              </Title>
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
