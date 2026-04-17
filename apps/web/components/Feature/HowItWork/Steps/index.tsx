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
import steps from "@/utils/StepsData";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";

export default function HowSteps() {
  const { t } = useTranslation();
  const items = steps;

  return (
    <StepsSection>
      <Inner>
        <Heading>
          <MonoText $use="Heading2">{t("nav.howItWorks")}</MonoText>
        </Heading>
        <Subtitle>
          <MonoText $use="H4_Medium" color={COLORS.neutral.GRAY_700}>
            {t("how.stepsSubtitle")}
          </MonoText>
        </Subtitle>
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
              <CardTitle>
                <MonoText $use="Heading3">{t(it.titleKey)}</MonoText>
              </CardTitle>
              <CardText>
                <MonoText $use="H5_Regular">{t(it.textKey)}</MonoText>
              </CardText>
            </Card>
          ))}
        </Grid>
      </Inner>
    </StepsSection>
  );
}
