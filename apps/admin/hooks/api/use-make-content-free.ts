"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";

type MakeContentFreePayload = {
  contentId: string;
  creatorId: string;
  paid?: { buyPrice?: number; rentPrice?: number; rentDurationHours?: number };
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

export function useMakeContentFree() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contentId, paid }: MakeContentFreePayload) =>
      ensureSuccess(
        apiClient(
          paid
            ? `/content/admin/make-paid/${contentId}`
            : API_ENDPOINTS.MAKE_CONTENT_FREE(contentId),
          {
            method: "POST",
            ...(paid ? { body: JSON.stringify(paid) } : {}),
          },
        ),
      ),
    onSuccess: (_data, { contentId, creatorId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.CONTENT_ENGAGEMENT, contentId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.CREATOR_CONTENTS, creatorId],
      });
    },
  });
}
