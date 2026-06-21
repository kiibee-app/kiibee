"use client";

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { DA, EN } from "@/utils/common";
import {
  normalizeAppLanguage,
  persistAppLanguage,
  type AppLanguage,
} from "@/utils/language";
import { Wrapper, Slider, LangButton } from "./styles";

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const currentLang = normalizeAppLanguage(
    i18n.resolvedLanguage || i18n.language,
  );

  const setLang = useCallback(
    (lng: AppLanguage) => {
      if (lng === currentLang) return;
      persistAppLanguage(lng);
      void i18n.changeLanguage(lng);
    },
    [currentLang, i18n],
  );

  return (
    <Wrapper
      className="notranslate"
      translate="no"
      role="radiogroup"
      aria-label="Language selection"
    >
      <Slider $active={currentLang} />
      <LangButton
        $active={currentLang === DA}
        onClick={() => setLang(DA)}
        role="radio"
        aria-checked={currentLang === DA}
        aria-label="Dansk"
        type="button"
      >
        {DA.toUpperCase()}
      </LangButton>
      <LangButton
        $active={currentLang === EN}
        onClick={() => setLang(EN)}
        role="radio"
        aria-checked={currentLang === EN}
        aria-label="English"
        type="button"
      >
        {EN.toUpperCase()}
      </LangButton>
    </Wrapper>
  );
};

export default LanguageToggle;
