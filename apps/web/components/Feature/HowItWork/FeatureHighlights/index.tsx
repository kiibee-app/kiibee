"use client";

import React from "react";
import Image from "next/image";
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
import { useTranslation } from "react-i18next";

export default function FeatureHighlights() {
  const { t } = useTranslation();

  const [active, setActive] = useState(0);

  const features = featureData.map((f) => ({ title: t(f.titleKey) || "" }));

  return (
    <Section>
      <Inner>
        <HeadingWrap>
          <Heading>{t("features.heading")}</Heading>
          <Sub>{t("features.sub")}</Sub>
        </HeadingWrap>

        <FeaturesRow>
          {features.map((f, i) => (
            <FeatureItem
              key={i}
              role="button"
              tabIndex={0}
              onClick={() => setActive(i)}
              onKeyDown={(e) => (e.key === "Enter" ? setActive(i) : null)}
              $active={active === i}
            >
              <Index>{i + 1}.</Index>
              <TopBar />
              <Label>{f.title}</Label>
            </FeatureItem>
          ))}
        </FeaturesRow>

        <MockRow $imageRight={active % 2 !== 0}>
          {active % 2 === 0 ? (
            <>
              <MockImageWrap $active={true}>
                <Image
                  src={featureData[active]?.image || featureData[0].image}
                  alt={t(`features.items.${active}.imageAlt`)}
                  fill
                  sizes="(max-width: 767px) 100vw, 60vw"
                  style={{ objectFit: "cover" }}
                  loading="eager"
                />
              </MockImageWrap>

              <MockText>{t(featureData[active]?.textKey)}</MockText>
            </>
          ) : (
            <>
              <MockText>{t(featureData[active]?.textKey)}</MockText>

              <MockImageWrap $active={true}>
                <Image
                  src={featureData[active]?.image || featureData[0].image}
                  alt={t(`features.items.${active}.imageAlt`)}
                  fill
                  sizes="(max-width: 767px) 100vw, 60vw"
                  style={{ objectFit: "cover" }}
                  loading="eager"
                />
              </MockImageWrap>
            </>
          )}
        </MockRow>
      </Inner>
    </Section>
  );
}
