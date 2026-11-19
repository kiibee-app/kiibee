"use client";

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";
import { DA, EN } from "@/utils/common";
import { STRING_EMPTY } from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import { isBrowser } from "@/utils/ui";
import {
  normalizeAppLanguage,
  persistAppLanguage,
  type AppLanguage,
} from "@/utils/language";
import { localizeHref } from "@/utils/localizedRoutes";
import { Wrapper, Slider, LangButton } from "./styles";

const LanguageToggle = ({
  sidebarStyle = false,
}: {
  sidebarStyle?: boolean;
}) => {
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

      const search = isBrowser ? window.location.search : STRING_EMPTY;
      const hash = isBrowser ? window.location.hash : STRING_EMPTY;
      const currentUrl = `${pathname || PATHS.HOME}${search}${hash}`;
      const href = localizeHref(currentUrl, lng);

      if (href !== currentUrl) {
        router.replace(href, { scroll: false });
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
        $isDanish
        $sidebarStyle={sidebarStyle}
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
        $sidebarStyle={sidebarStyle}
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
