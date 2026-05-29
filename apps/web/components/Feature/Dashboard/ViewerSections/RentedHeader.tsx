"use client";

import { useEffect } from "react";
import LeftIcon from "@/assets/icons/LeftIcon";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import { MonoText } from "@/components/UI/Monotext";
import { useTheme } from "styled-components";
import { getSearchPlaceholder } from "@/utils/viewerRented";
import type { RentedMode } from "@/utils/dummyData/viewerRentedMockData";
import {
  HeaderSearchArea,
  HeaderSearchButton,
  HeaderSearchInput,
  HeaderBackButton,
  HeaderTitleWrap,
  PageHeader,
} from "./styles";
import { useTranslation } from "react-i18next";

type Props = {
  title: string;
  mode: RentedMode;
  searchValue: string;
  isSearchOpen: boolean;
  onSearchChange: (value: string) => void;
  onToggleSearch: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onBackClick?: () => void;
};

export default function RentedHeader({
  title,
  mode,
  searchValue,
  isSearchOpen,
  onSearchChange,
  onToggleSearch,
  searchInputRef,
  onBackClick,
}: Props) {
  const { t } = useTranslation();
  const theme = useTheme();

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen, searchInputRef]);

  return (
    <PageHeader>
      <HeaderTitleWrap>
        {onBackClick ? (
          <HeaderBackButton
            type="button"
            aria-label={t("common.back")}
            onClick={onBackClick}
          >
            <LeftIcon style={{ transform: "rotate(180deg)" }} />
          </HeaderBackButton>
        ) : null}
        <MonoText $use="H4_SemiBold">{title}</MonoText>
      </HeaderTitleWrap>
      <HeaderSearchArea $open={isSearchOpen}>
        <HeaderSearchButton
          type="button"
          aria-label={t("common.toggleSearch")}
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
