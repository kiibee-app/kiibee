"use client";

import { useTranslation } from "react-i18next";
import creator from "@/assets/images/testimonial/creator.webp";
import {
  Author,
  Background,
  Card,
  Quote,
  Section,
  SectionInner,
} from "./styles";
import ScrollReveal from "@/components/UI/ScrollReveal";
import { LANDING_REVEAL } from "@/utils/landingUtils";

export default function TestimonialSection() {
  const { t } = useTranslation();

  return (
    <Section>
      <Background
        $src={creator.src}
        role="img"
        aria-label={t("testimonial.backgroundAlt")}
      />

      <SectionInner>
        <Card>
          <ScrollReveal>
            <Quote>{t("testimonial.quote")}</Quote>
          </ScrollReveal>
          <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
            <Author>{t("testimonial.author")}</Author>
          </ScrollReveal>
        </Card>
      </SectionInner>
    </Section>
  );
}
