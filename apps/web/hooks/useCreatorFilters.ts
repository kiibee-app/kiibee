import { useCallback, useState } from "react";
import { FilterSectionKey, PriceRange } from "@/types/filters";
import {
  CategoryOptionKey,
  DEFAULT_VISIBLE_CREATORS,
  FilterGroupKey,
  filterGroupMap,
  FormatOptionKey,
} from "@/utils/creatorFilters";
import { sanitizeDigits } from "@/utils/numericInput";

type UseCreatorFiltersParams = {
  categoryOptions: CategoryOptionKey[];
  formatOptions: FormatOptionKey[];
};

type SelectedOptions = Record<FilterGroupKey, string[]>;

const INITIAL_SELECTED_OPTIONS: SelectedOptions = {
  creators: [],
  categories: [],
  formats: [],
};

const INITIAL_PRICE_RANGE: PriceRange = {
  min: "",
  max: "",
};

function getAllOption(params: {
  group: FilterGroupKey;
  categoryOptions: CategoryOptionKey[];
  formatOptions: FormatOptionKey[];
}): string | null {
  const { group, categoryOptions, formatOptions } = params;

  if (group === filterGroupMap.categories) {
    return categoryOptions[0] ?? null;
  }

  if (group === filterGroupMap.formats) {
    return formatOptions[0] ?? null;
  }

  return null;
}

function getNextSelectedOptions(params: {
  currentOptions: string[];
  option: string;
  allOption: string | null;
}): string[] {
  const { currentOptions, option, allOption } = params;
  const isSelected = currentOptions.includes(option);

  if (allOption && option === allOption) {
    return isSelected ? [] : [option];
  }

  if (isSelected) {
    return currentOptions.filter((item) => item !== option);
  }

  return [...currentOptions.filter((item) => item !== allOption), option];
}

function useFilterPanelState() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedSection, setExpandedSection] =
    useState<FilterSectionKey | null>(null);

  const toggleFilter = useCallback(() => {
    setIsFilterOpen((prev) => {
      const next = !prev;

      if (next) {
        setExpandedSection(null);
      }

      return next;
    });
  }, []);

  const toggleSection = useCallback((section: FilterSectionKey) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  }, []);

  return {
    isFilterOpen,
    expandedSection,
    toggleFilter,
    toggleSection,
  };
}

function useSelectedFilterOptions({
  categoryOptions,
  formatOptions,
}: {
  categoryOptions: CategoryOptionKey[];
  formatOptions: FormatOptionKey[];
}) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(
    INITIAL_SELECTED_OPTIONS,
  );

  const toggleOption = useCallback(
    (group: FilterGroupKey, option: string) => {
      setSelectedOptions((prev) => {
        const currentOptions = prev[group];
        const allOption = getAllOption({
          group,
          categoryOptions,
          formatOptions,
        });

        return {
          ...prev,
          [group]: getNextSelectedOptions({
            currentOptions,
            option,
            allOption,
          }),
        };
      });
    },
    [categoryOptions, formatOptions],
  );

  return {
    selectedOptions,
    setSelectedOptions,
    toggleOption,
  };
}

function usePriceRangeFilter() {
  const [priceRange, setPriceRange] = useState<PriceRange>(INITIAL_PRICE_RANGE);

  const handlePriceChange = useCallback(
    (field: keyof PriceRange) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = sanitizeDigits(e.target.value);

      setPriceRange((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  return {
    priceRange,
    setPriceRange,
    handlePriceChange,
  };
}

function useRatingFilter() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  return {
    selectedRating,
    setSelectedRating,
  };
}

function useCreatorVisibility() {
  const [showAllCreators, setShowAllCreators] = useState(false);

  return {
    showAllCreators,
    setShowAllCreators,
  };
}

export function useCreatorFilters({
  categoryOptions,
  formatOptions,
}: UseCreatorFiltersParams) {
  const panelState = useFilterPanelState();
  const visibilityState = useCreatorVisibility();
  const selectedFilterOptions = useSelectedFilterOptions({
    categoryOptions,
    formatOptions,
  });
  const priceFilter = usePriceRangeFilter();
  const ratingFilter = useRatingFilter();

  return {
    ...panelState,
    ...visibilityState,
    ...selectedFilterOptions,
    ...priceFilter,
    ...ratingFilter,
    DEFAULT_VISIBLE_CREATORS,
  };
}
