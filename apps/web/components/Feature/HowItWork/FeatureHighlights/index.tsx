"use client";

import React, { useState } from "react";
import Image from "@/components/UI/SafeImage";
import {
  Section,
  Inner,
  HeadingWrap,
  Heading,
  Sub,
  FeaturesRow,
  FeatureItem,
  MockRow,
  MockImageWrap,
  MockText,
  Index,
  TopBar,
  Label,
} from "./styles";
import featureData from "@/utils/featureHighlights";
import { KEY_ENTER } from "@/utils/Constants";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import ScrollReveal from "@/components/UI/ScrollReveal";
import ImageReveal from "@/components/UI/ImageReveal";
import { LANDING_REVEAL, LANDING_REVEAL_VARIANTS } from "@/utils/landingUtils";
import { DA } from "@/utils/common";

export default function FeatureHighlights() {
  const { t, i18n } = useTranslation();
  const [active, setActive] = useState(0);

  const isDanish = i18n.language === DA;
  const currentFeature = featureData[active] || featureData[0];
  const activeImage = isDanish ? currentFeature.imageDa : currentFeature.image;

  const features = featureData.map((f) => ({ title: t(f.titleKey) || "" }));

  return (
    <Section>
      <Inner>
        <HeadingWrap>
          <ScrollReveal>
            <Heading>
              <MonoText $use="Heading2" color={COLORS.secondary.main}>
                {t("features.heading")}
              </MonoText>
            </Heading>
          </ScrollReveal>
          <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
            <Sub>
              <MonoText $use="H4_Medium">{t("features.sub")}</MonoText>
            </Sub>
          </ScrollReveal>
        </HeadingWrap>

        <FeaturesRow>
          {features.map((f, i) => (
            <ScrollReveal key={i} delay={LANDING_REVEAL.shortDelay * (i + 1)}>
              <FeatureItem
                role="button"
                tabIndex={0}
                onClick={() => setActive(i)}
                onKeyDown={(e) => (e.key === KEY_ENTER ? setActive(i) : null)}
                $active={active === i}
              >
                <Index>
                  <MonoText $use="H5_Medium" color={COLORS.neutral.GRAY}>
                    {i + 1}.
                  </MonoText>
                </Index>
                <TopBar />
                <Label>
                  <MonoText $use="Body_Regular" color={COLORS.neutral.GRAY}>
                    {f.title}
                  </MonoText>
                </Label>
              </FeatureItem>
            </ScrollReveal>
          ))}
        </FeaturesRow>

        <MockRow $imageRight={active % 2 !== 0}>
          <MockImageWrap $active={true} $imageRight={active % 2 !== 0}>
            <ImageReveal
              key={`${active}-${i18n.language}`}
              variant={LANDING_REVEAL_VARIANTS.fadeScale}
              duration={LANDING_REVEAL.revealDuration}
            >
              <Image
                src={activeImage}
                alt={t(`features.items.${active}.imageAlt`)}
                width={746}
                height={422}
                sizes="(max-width: 767px) 100vw, 65vw"
                loading="eager"
                priority={true}
                fetchPriority="high"
                quality={100}
                unoptimized
              />
            </ImageReveal>
          </MockImageWrap>

          <MockText $imageRight={active % 2 !== 0}>
            <ScrollReveal key={active} delay={LANDING_REVEAL.shortDelay}>
              <MonoText $use="Heading3" color={COLORS.neutral.GRAY}>
                {t(featureData[active]?.textKey)}
              </MonoText>
            </ScrollReveal>
          </MockText>
        </MockRow>
      </Inner>
    </Section>
  );
}
