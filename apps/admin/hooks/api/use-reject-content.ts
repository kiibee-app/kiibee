"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";

type RejectContentPayload = {
  contentId: string;
  reason: string;
  creatorId: string;
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

export function useRejectContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contentId, reason }: RejectContentPayload) => {
      const data = await ensureSuccess(
        apiClient(API_ENDPOINTS.REJECT_CONTENT(contentId), {
          method: "POST",
          body: JSON.stringify({ reason }),
        }),
      );
      return data;
    },
    onSuccess: (_data, { contentId, creatorId }) => {
      queryClient.removeQueries({
        queryKey: [QUERY_KEY.CONTENT_ENGAGEMENT, contentId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.CREATOR_CONTENTS, creatorId],
      });
    },
  });
}
