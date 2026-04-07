"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import {
  SectionWrapper,
  Inner,
  Title,
  Grid,
  Card,
  Text,
  Subtitle,
} from "./styles";

import img1 from "../../../../assets/images/platform/platform1.png";
import img2 from "../../../../assets/images/platform/platform2.png";
import img3 from "../../../../assets/images/platform/platform3.png";
import img4 from "../../../../assets/images/platform/platform4.png";

export default function MoreThanPlatformSection() {
  const { t } = useTranslation();

  return (
    <SectionWrapper>
      <Inner>
        <Title>{t("about.platform.title")}</Title>
        <Subtitle>
          <Text>{t("about.platform.intro")}</Text>
          <Text>{t("about.platform.description")}</Text>
        </Subtitle>
        <Grid>
          {[img1, img2, img3, img4].map((img, index) => (
            <Card key={index}>
              <Image
                src={img}
                alt="platform"
                fill
                style={{
                  objectFit: "cover",
                }}
                priority
              />
            </Card>
          ))}
        </Grid>
      </Inner>
    </SectionWrapper>
  );
}
