"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import type { Viewer } from "../../types/viewer";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";

export function useViewer(viewerId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEY.VIEWER_DETAIL, viewerId],
    enabled: Boolean(viewerId),
    queryFn: async () => {
      const response = await apiClient<Viewer>(
        API_ENDPOINTS.VIEWER_BY_ID(viewerId as string),
      );

      if (!response.success) {
        throw new Error(response.message || "Request failed");
      }

      if (!response.data) {
        throw new Error("Viewer not found");
      }

      return response.data;
    },
  });
}
