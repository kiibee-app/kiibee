"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import type { CreatorRequest } from "../../types/creator-request";

const CREATOR_REQUESTS_QUERY_KEY = ["creator-requests"];

type CreatorActionPayload = {
  requestId: string;
};

type CreatorAction = "approve" | "reject";

const CREATOR_ACTION_ENDPOINT: Record<CreatorAction, string> = {
  approve: "/auth/approve-creator",
  reject: "/auth/reject-creator",
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

export function useCreatorAction(action: CreatorAction) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatorActionPayload) =>
      ensureSuccess(
        apiClient(CREATOR_ACTION_ENDPOINT[action], {
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
