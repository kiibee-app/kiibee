"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import type { ExistingCreator } from "../../types/existing-creator";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";

export function useCreator(creatorId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEY.CREATOR_DETAIL, creatorId],
    enabled: Boolean(creatorId),
    queryFn: async () => {
      const response = await apiClient<ExistingCreator>(
        API_ENDPOINTS.CREATOR_BY_ID(creatorId as string),
      );

      if (!response.success) {
        throw new Error(response.message || "Request failed");
      }

      if (!response.data) {
        throw new Error("Creator not found");
      }

      return response.data;
    },
  });
}
