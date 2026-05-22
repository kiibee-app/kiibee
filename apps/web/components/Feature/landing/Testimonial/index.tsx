"use client";

import Image from "@/components/UI/SafeImage";
import { useTranslation } from "react-i18next";
import { ArrowIcon as ArrowSvg } from "@/assets/icons/arrowIcon";
import { Directions } from "@/utils/ui";
import creator from "@/assets/images/testimonial/creator.webp";
import {
  ArrowButton,
  ArrowIcon,
  Background,
  Card,
  Section,
  SectionInner,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import ScrollReveal from "@/components/UI/ScrollReveal";
import ImageReveal from "@/components/UI/ImageReveal";

export default function TestimonialSection() {
  const { t } = useTranslation();

  return (
    <Section>
      <Background>
        <ImageReveal
          variant="ken-burns"
          duration={1.8}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Image
            src={creator}
            alt={t("testimonial.backgroundAlt")}
            fill
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
        </ImageReveal>
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
          <ScrollReveal>
            <MonoText $use="Body_Medium">{t("testimonial.quote")}</MonoText>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <MonoText $use="Body_Regular">{t("testimonial.author")}</MonoText>
          </ScrollReveal>
        </Card>
      </SectionInner>
    </Section>
  );
}
