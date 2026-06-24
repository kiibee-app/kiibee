import { FilterGroupKey } from "@/utils/creatorFilters";
import { SortValue } from "@/utils/sortOptions";

export type FilterSectionKey = FilterGroupKey | "price" | "rating";

export type ExploreCreatorsHeroProps = {
  showControls?: boolean;
  sortBy?: SortValue;
  setSortBy?: (value: SortValue) => void;
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;
  placeholderKey?: string;
  title?: string;
};

export type PriceRange = {
  min: string;
  max: string;
};
