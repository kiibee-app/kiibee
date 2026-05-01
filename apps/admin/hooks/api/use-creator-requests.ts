"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import type { CreatorRequest } from "../../types/creator-request";

const CREATOR_REQUESTS_QUERY_KEY = ["creator-requests"];

type CreatorActionPayload = {
  requestId: string;
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

export function useCreatorRequests() {
  return useQuery({
    queryKey: CREATOR_REQUESTS_QUERY_KEY,
    queryFn: async () => {
      const data = await ensureSuccess<CreatorRequest[]>(
        apiClient<CreatorRequest[]>("/auth/all-creator-requests"),
      );

      return data ?? [];
    },
  });
}

export function useApproveCreator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatorActionPayload) =>
      ensureSuccess(
        apiClient("/auth/approve-creator", {
          method: "POST",
          body: JSON.stringify(payload),
        }),
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: CREATOR_REQUESTS_QUERY_KEY,
      });
    },
  });
}

export function useRejectCreator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatorActionPayload) =>
      ensureSuccess(
        apiClient("/auth/reject-creator", {
          method: "POST",
          body: JSON.stringify(payload),
        }),
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: CREATOR_REQUESTS_QUERY_KEY,
      });
    },
  });
}
