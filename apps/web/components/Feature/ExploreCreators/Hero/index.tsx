"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Hero, Inner, Content, Title, Controls, FilterBtn } from "./styles";
import SearchBar from "@/components/UI/SearchBar";
import { FilterIcon } from "@/assets/icons/filterIcon";
import { MonoText } from "@/components/UI/Monotext";
import { COLORS } from "@kiibee/ui/colors";
import { DEFAULT_SORT, SORT_OPTIONS, SortValue } from "@/utils/sortOptions";
import SortDropdown from "@/components/UI/SortDropdown";

type Props = {
  showControls?: boolean;
  setSortBy?: (value: SortValue) => void;
};

export default function ExploreCreatorsHero({
  showControls = true,
  setSortBy,
}: Props) {
  const { t } = useTranslation();

  return (
    <Hero>
      <Inner>
        <Content>
          {showControls && (
            <Title>
              <MonoText $use="Heading2" color={COLORS.neutral.OFF_WHITE}>
                {t("creators.title")}
              </MonoText>
            </Title>
          )}
          <Controls>
            {showControls && (
              <FilterBtn>
                <FilterIcon />
                {t("creators.filter")}
              </FilterBtn>
            )}
            <SearchBar placeholder={t("creators.search")} />
            {showControls && (
              <SortDropdown
                options={SORT_OPTIONS}
                value={DEFAULT_SORT}
                onChange={setSortBy}
              />
            )}
          </Controls>
        </Content>
      </Inner>
    </Hero>
  );
}
