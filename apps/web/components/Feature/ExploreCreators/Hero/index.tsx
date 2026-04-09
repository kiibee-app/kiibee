"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Hero, Inner, Content, Title, Controls, FilterBtn } from "./styles";

import SearchBar from "@/components/UI/SearchBar";
import { FilterIcon } from "@/assets/icons/filterIcon";
import SortDropdown from "@/components/UI/SortDropdown";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { DEFAULT_SORT, SORT_OPTIONS, SortValue } from "@/utils/sortOptions";

type Props = {
  setSortBy: (value: SortValue) => void;
};

export default function ExploreCreatorsHero({ setSortBy }: Props) {
  const { t } = useTranslation();

  return (
    <Hero>
      <Inner>
        <Content>
          <Title>
            <MonoText $use="Heading2" color={COLORS.neutral.OFF_WHITE}>
              {t("creators.title")}
            </MonoText>
          </Title>

          <Controls>
            <FilterBtn>
              <FilterIcon />
              {t("creators.filter")}
            </FilterBtn>

            <SearchBar placeholder={t("creators.search")} />

            <SortDropdown
              options={SORT_OPTIONS}
              value={DEFAULT_SORT}
              onChange={setSortBy}
            />
          </Controls>
        </Content>
      </Inner>
    </Hero>
  );
}
