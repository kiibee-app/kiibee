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
import img1 from "@/assets/images/platform/platform1.webp";
import img2 from "@/assets/images/platform/platform2.webp";
import img3 from "@/assets/images/platform/platform3.webp";
import img4 from "@/assets/images/platform/platform4.webp";
import COLORS from "@repo/ui/colors";
import { MonoText } from "@/components/UI/Monotext";

export default function MoreThanPlatformSection() {
  const { t } = useTranslation();

  return (
    <SectionWrapper>
      <Inner>
        <Title>
          <MonoText $use="Heading2" color={COLORS.primary.PALE_GREEN}>
            {t("about.platform.title")}
          </MonoText>
        </Title>
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
                sizes="(max-width: 767px) 116px, 126px"
                priority
              />
            </Card>
          ))}
        </Grid>
      </Inner>
    </SectionWrapper>
  );
}
