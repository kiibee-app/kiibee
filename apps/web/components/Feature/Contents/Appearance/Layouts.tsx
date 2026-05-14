"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppearancePanel } from "../styles";
import {
  Copy,
  Label,
  Hint,
  LayoutCaption,
  LayoutCard,
  LayoutCardWrap,
  LayoutGrid,
  LayoutImage,
  LayoutImageShell,
  LayoutTitle,
  Row,
  SectionList,
} from "./styles";
import { CONTENTS } from "@/utils/translationKeys";
import { layoutCards } from "@/utils/data";

export default function LayoutsSection() {
  const { t } = useTranslation();
  const [selectedLayout, setSelectedLayout] = useState("layout1");

  return (
    <AppearancePanel>
      <SectionList>
        <Row>
          <Copy>
            <Label>{t(CONTENTS.appearance.layouts.title)}</Label>
            <Hint>{t(CONTENTS.appearance.layouts.subtitle)}</Hint>
          </Copy>

          <LayoutGrid>
            {layoutCards.map((card) => (
              <LayoutCardWrap
                key={card.key}
                type="button"
                aria-label={t(card.titleKey)}
                aria-pressed={selectedLayout === card.key}
                $active={selectedLayout === card.key}
                onClick={() => setSelectedLayout(card.key)}
              >
                <LayoutCard $active={selectedLayout === card.key}>
                  <LayoutTitle>{t(card.titleKey)}</LayoutTitle>
                  <LayoutImageShell>
                    <LayoutImage
                      src={card.image}
                      alt={t(card.titleKey)}
                      fill
                      sizes="(max-width: 767px) 100vw, 33vw"
                      priority={card.key === layoutCards[0]?.key}
                    />
                  </LayoutImageShell>
                </LayoutCard>
                <LayoutCaption>{t(card.captionKey)}</LayoutCaption>
              </LayoutCardWrap>
            ))}
          </LayoutGrid>
        </Row>
      </SectionList>
    </AppearancePanel>
  );
}
