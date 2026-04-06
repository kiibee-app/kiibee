"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { LeftArrowIcon, RightArrowIcon } from "../../../../assets/icons";
import creator from "../../../../assets/images/testimonial/creator.jpg";
import {
  ArrowButton,
  ArrowIcon,
  Author,
  Background,
  Card,
  Quote,
  Section,
  SectionInner,
} from "./styles";

export default function TestimonialSection() {
  const { t } = useTranslation();

  return (
    <Section>
      <Background>
        <Image
          src={creator}
          alt={t("testimonial.backgroundAlt")}
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </Background>

      <ArrowButton aria-label={t("testimonial.prevAriaLabel")} $left>
        <ArrowIcon>
          <LeftArrowIcon />
        </ArrowIcon>
      </ArrowButton>

      <ArrowButton aria-label={t("testimonial.nextAriaLabel")}>
        <ArrowIcon>
          <RightArrowIcon />
        </ArrowIcon>
      </ArrowButton>

      <SectionInner>
        <Card>
          <Quote>{t("testimonial.quote")}</Quote>

          <Author>{t("testimonial.author")}</Author>
        </Card>
      </SectionInner>
    </Section>
  );
}
