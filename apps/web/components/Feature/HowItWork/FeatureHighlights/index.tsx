"use client";

import React from "react";
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
import { useState } from "react";
import { KEY_ENTER } from "@/utils/Constants";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import ScrollReveal from "@/components/UI/ScrollReveal";
import ImageReveal from "@/components/UI/ImageReveal";
import { LANDING_REVEAL, LANDING_REVEAL_VARIANTS } from "@/utils/landingUtils";

export default function FeatureHighlights() {
  const { t } = useTranslation();

  const [active, setActive] = useState(0);

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
          {active % 2 === 0 ? (
            <>
              <MockImageWrap $active={true}>
                <ImageReveal
                  variant={LANDING_REVEAL_VARIANTS.fadeScale}
                  duration={LANDING_REVEAL.revealDuration}
                >
                  <Image
                    src={featureData[active]?.image || featureData[0].image}
                    alt={t(`features.items.${active}.imageAlt`)}
                    fill
                    sizes="(max-width: 767px) 100vw, 60vw"
                    loading="eager"
                    priority
                  />
                </ImageReveal>
              </MockImageWrap>

              <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
                <MockText>
                  <MonoText $use="Heading3" color={COLORS.neutral.GRAY}>
                    {t(featureData[active]?.textKey)}
                  </MonoText>
                </MockText>
              </ScrollReveal>
            </>
          ) : (
            <>
              <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
                <MockText>
                  <MonoText $use="Heading3" color={COLORS.neutral.GRAY}>
                    {t(featureData[active]?.textKey)}
                  </MonoText>
                </MockText>
              </ScrollReveal>

              <MockImageWrap $active={true}>
                <ImageReveal
                  variant={LANDING_REVEAL_VARIANTS.fadeScale}
                  duration={LANDING_REVEAL.revealDuration}
                >
                  <Image
                    src={featureData[active]?.image || featureData[0].image}
                    alt={t(`features.items.${active}.imageAlt`)}
                    fill
                    sizes="(max-width: 767px) 100vw, 60vw"
                    loading="eager"
                  />
                </ImageReveal>
              </MockImageWrap>
            </>
          )}
        </MockRow>
      </Inner>
    </Section>
  );
}
