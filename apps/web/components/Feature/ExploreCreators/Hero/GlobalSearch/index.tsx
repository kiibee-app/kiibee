"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import SearchBar from "@/components/UI/SearchBar";
import { useGlobalSearch, UseGlobalSearchProps } from "@/hooks/useGlobalSearch";
import { CREATORS } from "@/utils/translationKeys";
import {
  GlobalSearchWrapper,
  SearchDropdown,
  SearchDropdownSection,
  SearchDropdownItem,
  SearchDropdownTitle,
  SearchEmptyText,
} from "./styles";

type GlobalSearchProps = UseGlobalSearchProps & {
  placeholderKey?: string;
};

export default function GlobalSearch({
  placeholderKey = CREATORS.search,
  ...props
}: GlobalSearchProps) {
  const { t } = useTranslation();

  const {
    searchQuery,
    setSearchQuery,
    isOpen,
    containerRef,
    isLoading,
    creators,
    tutorials,
    hasResults,
    handleContentClick,
    handleCreatorClick,
  } = useGlobalSearch(props);

  return (
    <GlobalSearchWrapper ref={containerRef}>
      <SearchBar
        placeholder={t(placeholderKey)}
        value={searchQuery}
        onChange={setSearchQuery}
        width="100%"
      />

      {isOpen && (
        <SearchDropdown>
          {isLoading && (
            <SearchDropdownItem $interactive={false}>
              <SearchEmptyText>{t("common.loading")}</SearchEmptyText>
            </SearchDropdownItem>
          )}

          {!isLoading && hasResults && creators && creators.length > 0 && (
            <SearchDropdownSection>
              <SearchDropdownTitle>
                {t("creators.creators")}
              </SearchDropdownTitle>
              {creators.map((creator) => (
                <SearchDropdownItem
                  key={creator.id}
                  onClick={handleCreatorClick(creator.id, creator.layout)}
                >
                  <SearchEmptyText>{creator.name}</SearchEmptyText>
                </SearchDropdownItem>
              ))}
            </SearchDropdownSection>
          )}

          {!isLoading && hasResults && tutorials && tutorials.length > 0 && (
            <SearchDropdownSection>
              <SearchDropdownTitle>
                {t("creators.contents")}
              </SearchDropdownTitle>
              {tutorials.map((tutorial) => (
                <SearchDropdownItem
                  key={tutorial.id}
                  onClick={handleContentClick(tutorial.id)}
                >
                  <SearchEmptyText>{tutorial.title}</SearchEmptyText>
                </SearchDropdownItem>
              ))}
            </SearchDropdownSection>
          )}

          {!isLoading && !hasResults && (
            <SearchDropdownItem $interactive={false}>
              <SearchEmptyText>{t("common.noResults")}</SearchEmptyText>
            </SearchDropdownItem>
          )}
        </SearchDropdown>
      )}
    </GlobalSearchWrapper>
  );
}
