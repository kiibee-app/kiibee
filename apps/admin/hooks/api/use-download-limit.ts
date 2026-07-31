"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";

const DOWNLOAD_LIMIT_QUERY_KEY = [QUERY_KEY.DOWNLOAD_LIMIT];

export type DownloadLimitResponse = {
  maxLimit: number;
};

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

export function useDownloadLimit() {
  return useQuery({
    queryKey: DOWNLOAD_LIMIT_QUERY_KEY,
    queryFn: async () => {
      const data = await ensureSuccess<DownloadLimitResponse>(
        apiClient<DownloadLimitResponse>(API_ENDPOINTS.DOWNLOAD_LIMIT),
      );

      return data ?? { maxLimit: 0 };
    },
  });
}

export function useSetDownloadLimit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (maxLimit: number) =>
      ensureSuccess(
        apiClient<{ maxLimit: number }>(API_ENDPOINTS.SET_DOWNLOAD_LIMIT, {
          method: "POST",
          body: JSON.stringify({ maxLimit }),
        }),
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: DOWNLOAD_LIMIT_QUERY_KEY,
      });
    },
  });
}
