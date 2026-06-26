"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import type { ContentEngagement } from "../../types/creator-content";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";

export function useContentEngagement(contentId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEY.CONTENT_ENGAGEMENT, contentId],
    enabled: Boolean(contentId),
    queryFn: async () => {
      const response = await apiClient<ContentEngagement>(
        API_ENDPOINTS.CONTENT_ENGAGEMENT(contentId as string),
      );

      if (!response.success) {
        throw new Error(response.message || "Request failed");
      }

      if (!response.data) {
        throw new Error("Content not found");
      }

      return response.data;
    },
  });
}
