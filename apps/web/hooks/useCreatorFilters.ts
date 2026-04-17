import { FilterSectionKey, PriceRange } from "@/types/filters";
import {
  CategoryOptionKey,
  DEFAULT_VISIBLE_CREATORS,
  FilterGroupKey,
  filterGroupMap,
  FormatOptionKey,
} from "@/utils/creatorFilters";
import { useCallback, useState } from "react";

export function useCreatorFilters({
  categoryOptions,
  formatOptions,
}: {
  categoryOptions: CategoryOptionKey[];
  formatOptions: FormatOptionKey[];
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedSection, setExpandedSection] =
    useState<FilterSectionKey | null>(null);

  const [showAllCreators, setShowAllCreators] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState<
    Record<FilterGroupKey, string[]>
  >({
    creators: [],
    categories: [],
    formats: [],
  });

  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: "",
    max: "",
  });

  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const toggleFilter = useCallback(() => {
    setIsFilterOpen((prev) => {
      const next = !prev;
      if (next) setExpandedSection(null);
      return next;
    });
  }, []);

  const toggleSection = useCallback((section: FilterSectionKey) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  }, []);

  const toggleOption = useCallback(
    (group: FilterGroupKey, option: string) => {
      setSelectedOptions((prev) => {
        const current = prev[group];
        const isSelected = current.includes(option);

        const allOption =
          group === filterGroupMap.categories
            ? categoryOptions[0]
            : group === filterGroupMap.formats
              ? formatOptions[0]
              : null;

        if (allOption && option === allOption) {
          return {
            ...prev,
            [group]: isSelected ? [] : [option],
          };
        }

        const next = isSelected
          ? current.filter((o) => o !== option)
          : [...current.filter((o) => o !== allOption), option];

        return {
          ...prev,
          [group]: next,
        };
      });
    },
    [categoryOptions, formatOptions],
  );

  const handlePriceChange = useCallback(
    (field: "min" | "max") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^\d]/g, "");

      setPriceRange((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  return {
    isFilterOpen,
    expandedSection,
    showAllCreators,
    selectedOptions,
    priceRange,
    selectedRating,
    setShowAllCreators,
    setSelectedRating,
    toggleFilter,
    toggleSection,
    toggleOption,
    handlePriceChange,
    DEFAULT_VISIBLE_CREATORS,
  };
}
