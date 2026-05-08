"use client";

import { useEffect } from "react";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import { MonoText } from "@/components/UI/Monotext";
import { useTheme } from "styled-components";
import { getSearchPlaceholder } from "@/utils/viewerRented";
import type { RentedMode } from "@/utils/dummyData/viewerRentedMockData";
import {
  HeaderSearchArea,
  HeaderSearchButton,
  HeaderSearchInput,
  PageHeader,
} from "./styles";

type Props = {
  title: string;
  mode: RentedMode;
  searchValue: string;
  isSearchOpen: boolean;
  onSearchChange: (value: string) => void;
  onToggleSearch: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
};

export default function RentedHeader({
  title,
  mode,
  searchValue,
  isSearchOpen,
  onSearchChange,
  onToggleSearch,
  searchInputRef,
}: Props) {
  const theme = useTheme();

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen, searchInputRef]);

  return (
    <PageHeader>
      <MonoText $use="H4_SemiBold">{title}</MonoText>
      <HeaderSearchArea $open={isSearchOpen}>
        <HeaderSearchButton
          type="button"
          aria-label="Toggle search"
          onClick={onToggleSearch}
        >
          <SearchIcon
            width={18}
            height={18}
            color={theme.colors.neutral.GRAY_400}
          />
        </HeaderSearchButton>

        <HeaderSearchInput
          ref={searchInputRef}
          $open={isSearchOpen}
          placeholder={getSearchPlaceholder(mode)}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </HeaderSearchArea>
    </PageHeader>
  );
}
