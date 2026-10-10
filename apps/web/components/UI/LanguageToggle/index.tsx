"use client";

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";
import { DA, EN } from "@/utils/common";
import {
  normalizeAppLanguage,
  persistAppLanguage,
  type AppLanguage,
} from "@/utils/language";
import { localizePathname } from "@/utils/localizedRoutes";
import { Wrapper, Slider, LangButton } from "./styles";

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = normalizeAppLanguage(
    i18n.resolvedLanguage || i18n.language,
  );

  const setLang = useCallback(
    (lng: AppLanguage) => {
      if (lng === currentLang) return;
      persistAppLanguage(lng);
      void i18n.changeLanguage(lng);

      const nextPath = localizePathname(pathname || "/", lng);
      const search = window.location.search;
      const hash = window.location.hash;
      const href = `${nextPath}${search}${hash}`;
      const currentHref = `${pathname}${search}${hash}`;

      if (href !== currentHref) {
        router.replace(href);
      }
    },
    [currentLang, i18n, pathname, router],
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
