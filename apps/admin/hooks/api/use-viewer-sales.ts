"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import type { ViewerSale } from "../../types/viewer";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";

export function useViewerSales(viewerId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEY.VIEWER_SALES, viewerId],
    enabled: Boolean(viewerId),
    queryFn: async () => {
      const response = await apiClient<ViewerSale[]>(
        API_ENDPOINTS.VIEWER_SALES(viewerId as string),
      );

      if (!response.success) {
        throw new Error(response.message || "Request failed");
      }

      return response.data ?? [];
    },
  });
}
