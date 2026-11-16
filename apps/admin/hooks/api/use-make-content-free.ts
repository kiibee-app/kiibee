"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";

type MakeContentFreePayload = {
  contentId: string;
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

export function useMakeContentFree() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contentId }: MakeContentFreePayload) =>
      ensureSuccess(
        apiClient(API_ENDPOINTS.MAKE_CONTENT_FREE(contentId), {
          method: "POST",
        }),
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
