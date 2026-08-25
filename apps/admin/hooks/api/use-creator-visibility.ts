"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";

type CreatorVisibilityPayload = {
  creatorId: string;
  isHidden: boolean;
};

type CreatorVisibilityResponse = {
  id: string;
  isHidden: boolean;
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

export function useUpdateCreatorVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ creatorId, isHidden }: CreatorVisibilityPayload) =>
      ensureSuccess<CreatorVisibilityResponse>(
        apiClient<CreatorVisibilityResponse>(
          API_ENDPOINTS.CREATOR_VISIBILITY(creatorId),
          {
            method: "PATCH",
            body: JSON.stringify({ isHidden }),
          },
        ),
      ),
    onSuccess: async (_data, { creatorId }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.EXISTING_CREATORS],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.CREATOR_DETAIL, creatorId],
        }),
      ]);
    },
  });
}
