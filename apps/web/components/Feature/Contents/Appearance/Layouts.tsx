"use client";

import React from "react";
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
              >
                <LayoutCard $active={card.key === "layout1"}>
                  <LayoutTitle>{t(card.titleKey)}</LayoutTitle>
                  <LayoutImageShell>
                    <LayoutImage
                      src={card.image}
                      alt={t(card.titleKey)}
                      fill
                      sizes="(max-width: 767px) 100vw, 33vw"
                      priority
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
