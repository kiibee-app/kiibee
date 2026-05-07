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
