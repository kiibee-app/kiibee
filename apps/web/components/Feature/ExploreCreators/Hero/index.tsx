"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import GlobalSearch from "./GlobalSearch";
import SortDropdown from "@/components/UI/SortDropdown";
import { DEFAULT_SORT, SORT_OPTIONS, SortValue } from "@/utils/sortOptions";
import { CREATORS } from "@/utils/translationKeys";
import {
  Hero,
  HeroTitleText,
  Inner,
  Content,
  Title,
  Controls,
  SearchBarContainer,
  SortDropdownContainer,
} from "./styles";
import { ExploreCreatorsHeroProps } from "@/types/filters";

export default function ExploreCreatorsHero({
  showControls = true,
  setSortBy,
  searchQuery,
  setSearchQuery,
  placeholderKey,
  title = CREATORS.title,
  sortBy = DEFAULT_SORT,
}: ExploreCreatorsHeroProps) {
  const { t } = useTranslation();

  return (
    <Hero>
      <Inner>
        <Content>
          {showControls && (
            <Title>
              <HeroTitleText>{t(title)}</HeroTitleText>
            </Title>
          )}
          <Controls>
            <SearchBarContainer>
              <GlobalSearch
                placeholderKey={placeholderKey}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </SearchBarContainer>
            {showControls && (
              <SortDropdownContainer>
                <SortDropdown
                  options={SORT_OPTIONS}
                  value={sortBy}
                  onChange={setSortBy}
                  label={t(CREATORS.sort)}
                  renderSelectedLabel={(value) =>
                    t(CREATORS.value(value as SortValue)).toLowerCase()
                  }
                  renderOptionLabel={(option) =>
                    t(CREATORS.value(option.value as SortValue)).toLowerCase()
                  }
                  width="100%"
                  maxWidth="100%"
                />
              </SortDropdownContainer>
            )}
          </Controls>
        </Content>
      </Inner>
    </Hero>
  );
}
