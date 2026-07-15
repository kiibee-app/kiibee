"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import type { ViewersResponse } from "../../types/viewer";
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

type ViewersQuery = {
  search?: string;
  page: number;
  limit: number;
};

export function useViewers({ search, page, limit }: ViewersQuery) {
  return useQuery({
    queryKey: [...VIEWERS_QUERY_KEY, { search, page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search && { search }),
      });

      const data = await ensureSuccess<ViewersResponse>(
        apiClient<ViewersResponse>(
          `${API_ENDPOINTS.ALL_VIEWERS}?${params.toString()}`,
        ),
      );

      return (
        data ?? {
          items: [],
          pagination: {
            page,
            limit,
            totalItems: 0,
            totalPages: 1,
          },
        }
      );
    },
  });
}
