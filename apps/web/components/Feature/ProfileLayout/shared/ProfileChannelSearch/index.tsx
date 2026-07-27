"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import { CrossIcon } from "@/assets/icons/crossIcon";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import { useCreatorProfileUi } from "@/hooks/useCreatorChannelLayout";
import { TONE_DARK, TONE_LIGHT } from "@/utils/Constants";
import { CREATE_PROFILE_HOME } from "@/utils/translationKeys";
import {
  SearchButton,
  SearchClearButton,
  SearchInput,
} from "@/components/UI/GenericTabs/styles";
import { NavbarSearchArea } from "./styles";

type ProfileChannelSearchProps = {
  textTone?: typeof TONE_DARK | typeof TONE_LIGHT;
};

export default function ProfileChannelSearch({
  textTone = TONE_DARK,
}: ProfileChannelSearchProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const {
    searchQuery,
    setSearchQuery,
    searchOpen,
    toggleSearch,
    isCollectionsPage,
  } = useCreatorProfileUi();

  const hasSearchText = Boolean(searchQuery);
  const isSearchOpen = Boolean(searchOpen || hasSearchText);
  const placeholder = isCollectionsPage
    ? t(CREATE_PROFILE_HOME.searchCollectionsPlaceholder)
    : t(CREATE_PROFILE_HOME.searchPlaceholder);
  const closedIconColor =
    textTone === TONE_LIGHT
      ? theme.colors.primary.WHITE_90
      : theme.colors.primary.BLACK;

  const handleSearchToggle = useCallback(() => {
    if (hasSearchText) return;
    toggleSearch();
  }, [hasSearchText, toggleSearch]);

  const handleSearchClear = useCallback(() => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  }, [setSearchQuery]);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  return (
    <NavbarSearchArea $open={isSearchOpen}>
      <SearchButton
        type="button"
        aria-label={t(CREATE_PROFILE_HOME.searchAriaLabel)}
        onClick={handleSearchToggle}
      >
        <SearchIcon
          width={18}
          height={18}
          color={isSearchOpen ? theme.colors.neutral.GRAY_400 : closedIconColor}
        />
      </SearchButton>

      <SearchInput
        ref={searchInputRef}
        $open={isSearchOpen}
        placeholder={placeholder}
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />

      {isSearchOpen && hasSearchText && (
        <SearchClearButton
          type="button"
          aria-label={t("common.clearSearch")}
          onClick={handleSearchClear}
        >
          <CrossIcon width={20} height={20} />
        </SearchClearButton>
      )}
    </NavbarSearchArea>
  );
}
