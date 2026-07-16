"use client";

import React from "react";
import { filterGroupMap } from "@/utils/creatorFilters";
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
  showAllCategories,
  setShowAllCreators,
  setShowAllCategories,
}: BuildListSectionsParams): ListSectionItem[] {
  const visibleCreatorLabels = showAllCreators
    ? creatorLabels
    : creatorLabels.slice(0, defaultVisibleCreators);
  const visibleCategoryLabels = showAllCategories
    ? categoryLabels
    : categoryLabels.slice(0, defaultVisibleCreators);

  return [
    {
      sectionKey: filterGroupMap.creators,
      title: t("creators.filters.sections.creators"),
      options: visibleCreatorLabels,
      isScrollable: showAllCreators,
      footer:
        creatorLabels.length > defaultVisibleCreators ? (
          <ShowMoreButton
            type="button"
            onClick={() => setShowAllCreators(!showAllCreators)}
          >
            <ShowMoreText>
              {t(
                showAllCreators
                  ? "creators.filters.seeLess"
                  : "creators.filters.showMore",
              )}
            </ShowMoreText>
          </ShowMoreButton>
        ) : undefined,
    },
    {
      sectionKey: filterGroupMap.categories,
      title: t("creators.filters.sections.categories"),
      options: visibleCategoryLabels,
      isScrollable: showAllCategories,
      footer:
        categoryLabels.length > defaultVisibleCreators ? (
          <ShowMoreButton
            type="button"
            onClick={() => setShowAllCategories(!showAllCategories)}
          >
            <ShowMoreText>
              {t(
                showAllCategories
                  ? "creators.filters.seeLess"
                  : "creators.filters.showMore",
              )}
            </ShowMoreText>
          </ShowMoreButton>
        ) : undefined,
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
  priceContent,
}: BuildRenderFilterSectionsParams): RenderFilterSectionItem[] {
  return [
    ...listSections.map((section) => ({
      key: section.sectionKey,
      title: section.title,
      content: (
        <>
          {renderOptionList(
            section.sectionKey,
            section.options,
            section.isScrollable,
          )}
          {section.footer}
        </>
      ),
    })),
    {
      key: FILTER_PANEL_SECTIONS.PRICE,
      title: priceTitle,
      content: priceContent,
    },
    // BUG (WEB): Rating Is Visible on the Explore Page - hidden per request
    // {
    //   key: FILTER_PANEL_SECTIONS.RATING,
    //   title: ratingTitle,
    //   content: ratingContent,
    // },
  ];
}
