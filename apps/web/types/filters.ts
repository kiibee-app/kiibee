import { FilterGroupKey } from "@/utils/creatorFilters";
import { SortValue } from "@/utils/sortOptions";

export type FilterSectionKey = FilterGroupKey | "price" | "rating";

export type ExploreCreatorsHeroProps = {
  showControls?: boolean;
  setSortBy?: (value: SortValue) => void;
};

export type PriceRange = {
  min: string;
  max: string;
};
