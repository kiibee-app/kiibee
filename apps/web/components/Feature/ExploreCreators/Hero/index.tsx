"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  Hero,
  Inner,
  Content,
  Title,
  Controls,
  FilterBtn,
  SortBox,
} from "./styles";
import SearchBar from "@/components/UI/SearchBar";
import { FilterIcon } from "@/assets/icons/filterIcon";
import { ArrowIcon } from "@/assets/icons/arrowIcon";
import { Directions } from "@/utils/ui";

export default function ExploreCreatorsHero() {
  const { t } = useTranslation();

  return (
    <Hero>
      <Inner>
        <Content>
          <Title>{t("creators.title")}</Title>
          <Controls>
            <FilterBtn>
              <FilterIcon />
              {t("creators.filter")}
            </FilterBtn>
            <SearchBar placeholder={t("creators.search")} />
            <SortBox>
              <span>{t("creators.sort")}</span>
              <ArrowIcon direction={Directions.DOWN} />
            </SortBox>
          </Controls>
        </Content>
      </Inner>
    </Hero>
  );
}
