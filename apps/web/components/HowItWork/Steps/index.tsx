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
import step1 from "../../../assets/images/steps/step1.png";
import step2 from "../../../assets/images/steps/step2.png";
import step3 from "../../../assets/images/steps/step3.png";

export default function HowSteps() {
  const { t } = useTranslation();

  const items = [
    {
      title: t("how.steps.browseTitle"),
      text: t("how.steps.browseText"),
      img: step1,
    },
    {
      title: t("how.steps.chooseTitle"),
      text: t("how.steps.chooseText"),
      img: step2,
    },
    {
      title: t("how.steps.accessTitle"),
      text: t("how.steps.accessText"),
      img: step3,
    },
  ];

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
                  alt={it.title}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </ImgWrap>
              <CardTitle>{it.title}</CardTitle>
              <CardText>{it.text}</CardText>
            </Card>
          ))}
        </Grid>
      </Inner>
    </StepsSection>
  );
}
