"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import type { Viewer } from "../../types/viewer";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";

const VIEWERS_QUERY_KEY = [QUERY_KEY.VIEWERS];

async function ensureSuccess<T>(
  promise: Promise<{
    success: boolean;
    data?: T;
    message?: string;
  }>,
) {
  const response = await promise;

  if (!response.success) {
    throw new Error(response.message || "Request failed");
  }

  return response.data;
}

export function useViewers() {
  return useQuery({
    queryKey: VIEWERS_QUERY_KEY,
    queryFn: async () => {
      const data = await ensureSuccess<Viewer[]>(
        apiClient<Viewer[]>(API_ENDPOINTS.ALL_VIEWERS),
      );

      return data ?? [];
    },
  });
}
