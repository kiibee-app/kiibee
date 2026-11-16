"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import { API_ENDPOINTS } from "@/utils/constants";

const key = ["stream-limit"];
export function useStreamLimit() {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const response = await apiClient<{ maxStreamLimit: number }>(
        API_ENDPOINTS.STREAM_LIMIT,
      );
      if (!response.success || !response.data)
        throw new Error(response.message || "Failed to load stream limit");
      return response.data;
    },
  });
}
export function useSetStreamLimit() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (maxStreamLimit: number) => {
      const response = await apiClient<{ maxStreamLimit: number }>(
        API_ENDPOINTS.SET_STREAM_LIMIT,
        { method: "POST", body: JSON.stringify({ maxStreamLimit }) },
      );
      if (!response.success)
        throw new Error(response.message || "Failed to save stream limit");
      return response.data;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: key }),
  });
}
