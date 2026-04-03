"use client";

import React from "react";
import Image from "next/image";
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
import steps from "../../../../utils/StepsData";

export default function HowSteps() {
  const { t } = useTranslation();
  const items = steps;

  return (
    <StepsSection>
      <Inner>
        <Heading>{t("nav.howItWorks")}</Heading>
        <Subtitle>{t("how.stepsSubtitle")}</Subtitle>
        <Grid>
          {items.map((it, idx) => (
            <Card key={idx}>
              <ImgWrap>
                <Image
                  src={it.img}
                  alt={t(it.titleKey)}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </ImgWrap>
              <CardTitle>{t(it.titleKey)}</CardTitle>
              <CardText>{t(it.textKey)}</CardText>
            </Card>
          ))}
        </Grid>
      </Inner>
    </StepsSection>
  );
}
