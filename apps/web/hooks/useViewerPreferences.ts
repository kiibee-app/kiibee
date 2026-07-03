"use client";

import { useMemo } from "react";
import { useGetAPI, API } from "@/lib/http/api";

type ApiResponse<T> = { success?: boolean; message?: string; data?: T | null };
import { VideoIcon } from "@/assets/icons";
import {
  ContentTypeItem,
  TaxonomyItem,
  TYPE_ICON_MAP,
} from "@/types/cardTypes";

export const useViewerPreferences = () => {
  const categoriesQuery = useGetAPI<ApiResponse<TaxonomyItem[]>>(
    API.content.categories,
  );
  const contentTypesQuery = useGetAPI<ApiResponse<TaxonomyItem[]>>(
    API.content.types,
  );

  const categories = useMemo(() => {
    const data = categoriesQuery.data?.data;
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      key: item.id,
      name: item.name,
    }));
  }, [categoriesQuery.data]);

  const contentTypes: ContentTypeItem[] = useMemo(() => {
    const data = contentTypesQuery.data?.data;
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      key: item.id,
      name: item.name,
      icon: TYPE_ICON_MAP[item.id] ?? VideoIcon,
    }));
  }, [contentTypesQuery.data]);

  return {
    categories,
    contentTypes,
    isLoading: categoriesQuery.isLoading || contentTypesQuery.isLoading,
    isError: categoriesQuery.isError || contentTypesQuery.isError,
  };
};
