import React from "react";
import { FilterGroupKey } from "@/utils/creatorFilters";
import { TFunction } from "i18next";
import { FilterSectionKey } from "./filters";

export type OptionItem = {
  key: string;
  label: string;
};
export const FILTER_PANEL_SECTIONS = {
  PRICE: "price",
  RATING: "rating",
} as const;

export const PRICE_RANGE_FIELDS = {
  MIN: "min",
  MAX: "max",
} as const;

export type PriceRangeFieldKey =
  (typeof PRICE_RANGE_FIELDS)[keyof typeof PRICE_RANGE_FIELDS];

export type CreatorFiltersControlRefs = {
  filterButtonRef: React.RefObject<HTMLButtonElement | null>;
  filterOverlayRef: React.RefObject<HTMLDivElement | null>;
};

export type CreatorFiltersControlState = {
  isFilterOpen: boolean;
  expandedSection: FilterSectionKey | null;
  showAllCreators: boolean;
  selectedOptions: Record<FilterGroupKey, string[]>;
  priceRange: { min: string; max: string };
  selectedRating: number | null;
};

export type CreatorFiltersControlActions = {
  toggleFilter: () => void;
  setShowAllCreators: (show: boolean) => void;
  setSelectedRating: (rating: number) => void;
  toggleSection: (section: FilterSectionKey) => void;
  toggleOption: (group: FilterGroupKey, option: string) => void;
  handlePriceChange: (
    field: PriceRangeFieldKey,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export type CreatorFiltersControlProps = {
  refs: CreatorFiltersControlRefs;
  state: CreatorFiltersControlState;
  categoryLabels: OptionItem[];
  formatLabels: OptionItem[];
  creatorLabels: OptionItem[];
  defaultVisibleCreators: number;
  actions: CreatorFiltersControlActions;
};

export type ListSectionItem = {
  sectionKey: FilterGroupKey;
  title: string;
  options: OptionItem[];
  footer?: React.ReactNode;
};

export type BuildListSectionsParams = {
  t: TFunction;
  creatorLabels: OptionItem[];
  categoryLabels: OptionItem[];
  formatLabels: OptionItem[];
  defaultVisibleCreators: number;
  showAllCreators: boolean;
  setShowAllCreators: (show: boolean) => void;
};

export type RenderFilterSectionItem = {
  key: FilterSectionKey;
  title: string;
  content: React.ReactNode;
};

export type BuildRenderFilterSectionsParams = {
  listSections: ListSectionItem[];
  renderOptionList: (
    group: FilterGroupKey,
    options: OptionItem[],
  ) => React.ReactNode;
  priceTitle: string;
  ratingTitle: string;
  priceContent: React.ReactNode;
  ratingContent: React.ReactNode;
};
