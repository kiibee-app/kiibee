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
import { useAppearanceForm } from "./AppearanceFormContext";
import type { CreatorLayoutKey } from "@/utils/creatorChannel";

export default function LayoutsSection() {
  const { t } = useTranslation();
  const { values, setLayout } = useAppearanceForm();

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
                aria-pressed={values.layout === card.key}
                $active={values.layout === card.key}
                onClick={() => setLayout(card.key as CreatorLayoutKey)}
              >
                <LayoutCard $active={values.layout === card.key}>
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
