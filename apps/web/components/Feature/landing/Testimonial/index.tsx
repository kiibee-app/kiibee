"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ArrowIcon as ArrowSvg } from "@/assets/icons/arrowIcon";
import { Directions } from "@/utils/ui";
import creator from "../../../../assets/images/testimonial/creator.jpg";
import {
  ArrowButton,
  ArrowIcon,
  Background,
  Card,
  Section,
  SectionInner,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";

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
          <ArrowSvg direction={Directions.LEFT} />
        </ArrowIcon>
      </ArrowButton>

      <ArrowButton aria-label={t("testimonial.nextAriaLabel")}>
        <ArrowIcon>
          <ArrowSvg direction={Directions.RIGHT} />
        </ArrowIcon>
      </ArrowButton>

      <SectionInner>
        <Card>
          <MonoText $use="Body_Medium">{t("testimonial.quote")}</MonoText>
          <MonoText $use="Body_Regular">{t("testimonial.author")}</MonoText>
        </Card>
      </SectionInner>
    </Section>
  );
}
