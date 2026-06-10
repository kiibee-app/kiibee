import { API } from "@/lib/http/api/endpoints";
import { axiosClient } from "@/lib/http/axiosClient";
import { withoutAllFilterOption } from "@/hooks/feed/useExploreContent";
import {
  ACCESS_TYPE_FREE,
  CATEGORY_ALL,
  SORT_OPTION_AZ,
} from "@/utils/Constants";
import type { FeedContentItem } from "@/utils/feedContentToTutorial";

export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T | null;
};

export interface FetchAllContentParams {
  allContentId: string;
  sortOption: string;
  debouncedSearch: string;
  categories: string[];
  creators: string[];
  formats: string[];
  priceRange: { min: string; max: string };
  selectedRating: number | null;
  limit: number;
}

export async function fetchAllContent({
  allContentId,
  sortOption,
  debouncedSearch,
  categories,
  creators,
  formats,
  priceRange,
  selectedRating,
  limit,
}: FetchAllContentParams) {
  const selectedCategoryIds = withoutAllFilterOption(categories);
  const selectedFormatIds = withoutAllFilterOption(formats);

  const body = {
    categoryId:
      selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
    creatorId: creators.length > 0 ? creators : undefined,
    contentTypeId: selectedFormatIds.length > 0 ? selectedFormatIds : undefined,
    minPrice: priceRange.min || undefined,
    maxPrice: priceRange.max || undefined,
    rating: selectedRating ?? undefined,
    ...(allContentId === ACCESS_TYPE_FREE
      ? { accessType: ACCESS_TYPE_FREE }
      : {}),
  };

  const queryParams = {
    limit,
    search: debouncedSearch || undefined,
    sort: sortOption === SORT_OPTION_AZ ? CATEGORY_ALL : sortOption,
  };

  const response = await axiosClient.post<ApiResponse<FeedContentItem[]>>(
    API.content.all,
    body,
    { params: queryParams },
  );
  return response.data;
}
