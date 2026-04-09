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
import { MonoText } from "@/components/UI/Monotext";
import { COLORS } from "@kiibee/ui/colors";

export default function ExploreCreatorsHero() {
  const { t } = useTranslation();

  return (
    <Hero>
      <Inner>
        <Content>
          <Title>
            <MonoText $use="Heading2" color={COLORS.neutral.OFF_WHITE}>
              {t("creators.title")}
            </MonoText>
          </Title>{" "}
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
