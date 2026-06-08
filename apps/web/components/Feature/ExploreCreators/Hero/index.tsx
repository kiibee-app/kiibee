"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import SearchBar from "@/components/UI/SearchBar";
import SortDropdown from "@/components/UI/SortDropdown";
import { DEFAULT_SORT, SORT_OPTIONS, SortValue } from "@/utils/sortOptions";
import { CREATORS } from "@/utils/translationKeys";
import { Hero, HeroTitleText, Inner, Content, Title, Controls } from "./styles";
import { ExploreCreatorsHeroProps } from "@/types/filters";

export default function ExploreCreatorsHero({
  showControls = true,
  setSortBy,
}: ExploreCreatorsHeroProps) {
  const { t } = useTranslation();

  return (
    <Hero>
      <Inner>
        <Content>
          {showControls && (
            <Title>
              <HeroTitleText>{t("creators.title")}</HeroTitleText>
            </Title>
          )}
          <Controls>
            <SearchBar placeholder={t("creators.search")} />
            {showControls && (
              <SortDropdown
                options={SORT_OPTIONS}
                value={DEFAULT_SORT}
                onChange={setSortBy}
                label={t(CREATORS.sort)}
                renderSelectedLabel={(value) =>
                  t(CREATORS.value(value as SortValue)).toLowerCase()
                }
                renderOptionLabel={(option) =>
                  t(CREATORS.value(option.value as SortValue)).toLowerCase()
                }
              />
            )}
          </Controls>
        </Content>
      </Inner>
    </Hero>
  );
}
