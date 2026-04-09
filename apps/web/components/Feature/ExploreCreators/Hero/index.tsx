"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Hero, Inner, Content, Title, Controls, FilterBtn } from "./styles";
import SearchBar from "@/components/UI/SearchBar";
import { FilterIcon } from "@/assets/icons/filterIcon";
import SortDropdown from "@/components/UI/SortDropdown";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";

export default function ExploreCreatorsHero() {
  const { t } = useTranslation();

  const options = [
    { label: "a-z", value: "a-z" },
    { label: "subscribers", value: "subscribers" },
    { label: "newest", value: "newest" },
  ];

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
              options={options}
              value="a-z"
              onChange={(val) => {
                console.log("Selected:", val);
              }}
            />
          </Controls>
        </Content>
      </Inner>
    </Hero>
  );
}
