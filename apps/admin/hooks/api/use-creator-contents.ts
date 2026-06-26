"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import type { CreatorContentItem } from "../../types/creator-content";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";

export function useCreatorContents(creatorId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEY.CREATOR_CONTENTS, creatorId],
    enabled: Boolean(creatorId),
    queryFn: async () => {
      const response = await apiClient<CreatorContentItem[]>(
        API_ENDPOINTS.CREATOR_CONTENTS(creatorId as string),
      );

      if (!response.success) {
        throw new Error(response.message || "Request failed");
      }

      return response.data ?? [];
    },
  });
}
