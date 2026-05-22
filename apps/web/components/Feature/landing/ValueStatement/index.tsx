"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Section, Inner, Content, Title, Background, Subtitle } from "./styles";
import Image from "@/components/UI/SafeImage";
import valueBg from "@/assets/images/cta-buttom.webp";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { ImageSource, VARIANT } from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import ScrollReveal from "@/components/UI/ScrollReveal";
import ImageReveal from "@/components/UI/ImageReveal";

type Props = {
  bgImage?: ImageSource;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
};

export default function ValueStatement({
  bgImage,
  title,
  subtitle,
  ctaText,
  ctaHref,
}: Props) {
  const { t } = useTranslation();

  return (
    <Section>
      <Background>
        <ImageReveal
          variant="fade-scale"
          duration={1.6}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Image
            src={bgImage || valueBg}
            alt={t("value.bgAlt")}
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </ImageReveal>
      </Background>

      <Inner>
        <Content>
          <ScrollReveal>
            <Title>
              <MonoText $use="Heading2" color={COLORS.primary.WHITE}>
                {title || t("value.title")}
              </MonoText>
            </Title>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <Subtitle>
              <MonoText $use="H5_Regular" color={COLORS.primary.WHITE}>
                {subtitle || t("value.subtitle")}
              </MonoText>
            </Subtitle>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <GenericButton
              asAnchor
              href={ctaHref ?? PATHS.AUTH_SIGNUP}
              variant={VARIANT.PRIMARY_LITE}
            >
              {ctaText || t("value.cta")}
            </GenericButton>
          </ScrollReveal>
        </Content>
      </Inner>
    </Section>
  );
}
