"use client";

import React from "react";
import Image from "@/components/UI/SafeImage";
import {
  Section,
  Inner,
  ImgWrap,
  Content,
  Title,
  Text,
  CTAWrap,
} from "./styles";
import heroImg from "@/assets/images/steps/cameraman.webp";
import GenericButton from "@/components/UI/GenericButton";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import { VARIANT } from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import ScrollReveal from "@/components/UI/ScrollReveal";
import ImageReveal from "@/components/UI/ImageReveal";
import { LANDING_REVEAL, LANDING_REVEAL_VARIANTS } from "@/utils/landingUtils";

export default function CustomerSection() {
  const { t } = useTranslation();

  return (
    <Section>
      <Inner>
        <ImgWrap>
          <ImageReveal
            variant={LANDING_REVEAL_VARIANTS.slideLeft}
            duration={LANDING_REVEAL.longRevealDuration}
          >
            <Image
              src={heroImg}
              alt={t("how.customerAlt")}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 50vw"
              loading="eager"
              priority
            />
          </ImageReveal>
        </ImgWrap>

        <Content>
          <ScrollReveal>
            <Title>
              <MonoText $use="Heading2">{t("how.customerTitle")}</MonoText>
            </Title>
          </ScrollReveal>

          <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
            <Text>{t("how.customerLead")}</Text>
          </ScrollReveal>

          <ScrollReveal delay={LANDING_REVEAL.shortDelay * 2}>
            <Text>{t("how.customerBody")}</Text>
          </ScrollReveal>

          <ScrollReveal delay={LANDING_REVEAL.shortDelay * 3}>
            <CTAWrap>
              <GenericButton
                asAnchor
                href={PATHS.ABOUT}
                variant={VARIANT.PRIMARY}
              >
                {t("how.customerCta")}
              </GenericButton>
            </CTAWrap>
          </ScrollReveal>
        </Content>
      </Inner>
    </Section>
  );
}
