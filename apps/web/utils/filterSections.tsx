"use client";

import React from "react";
import { CREATOR_OPTIONS, filterGroupMap } from "@/utils/creatorFilters";
import {
  ShowMoreButton,
  ShowMoreText,
} from "../components/Feature/ExploreCreators/Hero/styles";
import {
  BuildListSectionsParams,
  ListSectionItem,
  RenderFilterSectionItem,
  FILTER_PANEL_SECTIONS,
  BuildRenderFilterSectionsParams,
} from "@/types/exportCreators";

export function buildListSections({
  t,
  creatorLabels,
  categoryLabels,
  formatLabels,
  defaultVisibleCreators,
  showAllCreators,
  setShowAllCreators,
}: BuildListSectionsParams): ListSectionItem[] {
  return [
    {
      sectionKey: filterGroupMap.creators,
      title: t("creators.filters.sections.creators"),
      options: creatorLabels,
      footer:
        CREATOR_OPTIONS.length > defaultVisibleCreators && !showAllCreators ? (
          <ShowMoreButton
            type="button"
            onClick={() => setShowAllCreators(true)}
          >
            <ShowMoreText>{t("creators.filters.showMore")}</ShowMoreText>
          </ShowMoreButton>
        ) : undefined,
    },
    {
      sectionKey: filterGroupMap.categories,
      title: t("creators.filters.sections.categories"),
      options: categoryLabels,
    },
    {
      sectionKey: filterGroupMap.formats,
      title: t("creators.filters.sections.formats"),
      options: formatLabels,
    },
  ];
}

export function buildRenderFilterSections({
  listSections,
  renderOptionList,
  priceTitle,
  ratingTitle,
  priceContent,
  ratingContent,
}: BuildRenderFilterSectionsParams): RenderFilterSectionItem[] {
  return [
    ...listSections.map((section) => ({
      key: section.sectionKey,
      title: section.title,
      content: (
        <>
          {renderOptionList(section.sectionKey, section.options)}
          {section.footer}
        </>
      ),
    })),
    {
      key: FILTER_PANEL_SECTIONS.PRICE,
      title: priceTitle,
      content: priceContent,
    },
    {
      key: FILTER_PANEL_SECTIONS.RATING,
      title: ratingTitle,
      content: ratingContent,
    },
  ];
}
