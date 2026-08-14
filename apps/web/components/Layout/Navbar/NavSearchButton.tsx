"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { PATHS } from "@/utils/path";
import { NAV } from "@/utils/translationKeys";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import { SearchIconButton } from "./styles";
import type { TONE_DARK, TONE_LIGHT } from "@/utils/Constants";

type NavSearchButtonProps = {
  textTone?: typeof TONE_DARK | typeof TONE_LIGHT;
  hide?: boolean;
};

export default function NavSearchButton({
  textTone,
  hide,
}: NavSearchButtonProps) {
  const { t } = useTranslation();

  if (hide) return null;

  return (
    <SearchIconButton
      href={PATHS.EXPLORE}
      $textTone={textTone}
      aria-label={t(NAV.explore)}
    >
      <SearchIcon width={18} height={18} color="currentColor" />
    </SearchIconButton>
  );
}
