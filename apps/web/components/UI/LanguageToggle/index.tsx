"use client";

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { STORAGE_KEY } from "@/utils/common";
import { Wrapper, Slider, LangButton } from "./styles";
import { DA, EN } from "@/utils/common";

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as typeof DA | typeof EN;

  const setLang = useCallback(
    (lng: typeof DA | typeof EN) => {
      if (lng === currentLang) return;
      localStorage.setItem(STORAGE_KEY, lng);
      i18n.changeLanguage(lng);
    },
    [currentLang, i18n],
  );

  return (
    <Wrapper role="radiogroup" aria-label="Language selection">
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
