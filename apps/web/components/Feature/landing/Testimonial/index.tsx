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
  testimonialRevealStyle,
  testimonialImageStyle,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import ScrollReveal from "@/components/UI/ScrollReveal";
import ImageReveal from "@/components/UI/ImageReveal";
import { LANDING_REVEAL } from "@/utils/landingReveal";
import { IMAGE_SIZES } from "@/utils/imageSizes";
import {
  LANDING_IMAGE_FLAGS,
  LANDING_REVEAL_VARIANTS,
} from "@/utils/landingConfig";

export default function TestimonialSection() {
  const { t } = useTranslation();

  return (
    <Section>
      <Background>
        <ImageReveal
          variant={LANDING_REVEAL_VARIANTS.kenBurns}
          duration={LANDING_REVEAL.heroKenBurnsDuration}
          style={testimonialRevealStyle}
        >
          <Image
            src={creator}
            alt={t("testimonial.backgroundAlt")}
            fill={LANDING_IMAGE_FLAGS.fill}
            sizes={IMAGE_SIZES.fullViewport}
            style={testimonialImageStyle}
            priority={LANDING_IMAGE_FLAGS.priority}
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
          <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
            <MonoText $use="Body_Regular">{t("testimonial.author")}</MonoText>
          </ScrollReveal>
        </Card>
      </SectionInner>
    </Section>
  );
}
