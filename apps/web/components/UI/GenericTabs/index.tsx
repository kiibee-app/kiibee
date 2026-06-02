"use client";

import { CrossIcon } from "@/assets/icons/crossIcon";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef } from "react";
import { useTheme } from "styled-components";
import {
  SearchArea,
  SearchButton,
  SearchClearButton,
  SearchInput,
  TabButton,
  TabLabel,
  TabsRow,
} from "./styles";
import { useTabsKeyboard } from "@/hooks/useTabsKeyboard";
import { useTranslation } from "react-i18next";

type GenericTabItem<T extends string> = {
  key: T;
  label: string;
};

type SearchConfig = {
  open: boolean;
  value: string;
  placeholder?: string;
  onToggle: () => void;
  onChange: (value: string) => void;
  ariaLabel?: string;
  alwaysOpen?: boolean;
  icon?: ReactNode;
};

type GenericTabsProps<T extends string> = {
  tabs: GenericTabItem<T>[];
  activeTab: T;
  onTabChange: (key: T) => void;
  search?: SearchConfig;
  tabPanelId?: string;
};

export default function GenericTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  search,
  tabPanelId,
}: GenericTabsProps<T>) {
  const { t } = useTranslation();
  const theme = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const hasSearchText = Boolean(search?.value);
  const isSearchOpen = search?.alwaysOpen
    ? true
    : Boolean(search?.open || hasSearchText);

  const handleSearchToggle = useCallback(() => {
    if (!search || search.alwaysOpen) return;
    if (hasSearchText) return;
    search.onToggle();
  }, [hasSearchText, search]);

  const handleSearchClear = useCallback(() => {
    if (!search) return;
    search.onChange("");
    searchInputRef.current?.focus();
  }, [search]);

  const { tabRefs, handleTabKeyDown } = useTabsKeyboard({
    tabs,
    onTabChange,
  });

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  return (
    <TabsRow role="tablist">
      {tabs.map((tab, i) => (
        <TabButton
          key={tab.key}
          ref={(el) => {
            tabRefs.current[i] = el;
          }}
          type="button"
          role="tab"
          tabIndex={activeTab === tab.key ? 0 : -1}
          aria-selected={activeTab === tab.key}
          aria-controls={tabPanelId ?? `tabpanel-${tab.key}`}
          $active={activeTab === tab.key}
          onClick={() => onTabChange(tab.key)}
          onKeyDown={(e) => handleTabKeyDown(e, i)}
        >
          <TabLabel data-label={tab.label} $active={activeTab === tab.key}>
            <span>{tab.label}</span>
          </TabLabel>
        </TabButton>
      ))}

      {search && (
        <SearchArea $open={isSearchOpen}>
          <SearchButton
            type="button"
            aria-label={search.ariaLabel ?? t("common.toggleSearch")}
            onClick={search.alwaysOpen ? undefined : handleSearchToggle}
          >
            {search.icon ?? (
              <SearchIcon
                width={18}
                height={18}
                color={theme.colors.neutral.GRAY_400}
              />
            )}
          </SearchButton>

          <SearchInput
            ref={searchInputRef}
            $open={isSearchOpen}
            placeholder={search.placeholder}
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
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
        </SearchArea>
      )}
    </TabsRow>
  );
}
