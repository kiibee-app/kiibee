"use client";

import { SearchIcon } from "@/assets/icons/searchBarIcon";
import { useEffect, useRef } from "react";
import { useTheme } from "styled-components";
import {
  SearchArea,
  SearchButton,
  SearchInput,
  TabButton,
  TabsRow,
} from "./styles";

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
};

type GenericTabsProps<T extends string> = {
  tabs: GenericTabItem<T>[];
  activeTab: T;
  onTabChange: (key: T) => void;
  search?: SearchConfig;
};

export default function GenericTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  search,
}: GenericTabsProps<T>) {
  const theme = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isSearchOpen = search?.alwaysOpen ? true : !!search?.open;

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  return (
    <TabsRow>
      {tabs.map((tab) => (
        <TabButton
          key={tab.key}
          type="button"
          $active={activeTab === tab.key}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </TabButton>
      ))}

      {search && (
        <SearchArea $open={isSearchOpen}>
          <SearchButton
            type="button"
            aria-label={search.ariaLabel ?? "Toggle search"}
            onClick={search.alwaysOpen ? undefined : search.onToggle}
          >
            <SearchIcon
              width={18}
              height={18}
              color={theme.colors.neutral.GRAY_400}
            />
          </SearchButton>

          <SearchInput
            ref={searchInputRef}
            $open={isSearchOpen}
            placeholder={search.placeholder}
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
          />
        </SearchArea>
      )}
    </TabsRow>
  );
}
