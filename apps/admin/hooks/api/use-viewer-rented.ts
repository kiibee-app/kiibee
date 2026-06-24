"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import type { ViewerContentData } from "../../types/viewer";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";

export function useViewerRentedData(viewerId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEY.VIEWER_RENTED, viewerId],
    enabled: Boolean(viewerId),
    queryFn: async () => {
      const response = await apiClient<ViewerContentData>(
        API_ENDPOINTS.VIEWER_RENTED_DATA(viewerId as string),
      );

      if (!response.success) {
        throw new Error(response.message || "Request failed");
      }

      return (
        response.data ?? {
          videos: [],
          audios: [],
          pdfs: [],
          collections: [],
        }
      );
    },
  });
}
