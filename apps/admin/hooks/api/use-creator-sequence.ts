"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";

type CreatorSequencePayload = {
  creatorId: string;
  sequence: number | null;
};

type CreatorSequenceResponse = {
  id: string;
  sequence: number | null;
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

export function useUpdateCreatorSequence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ creatorId, sequence }: CreatorSequencePayload) =>
      ensureSuccess<CreatorSequenceResponse>(
        apiClient<CreatorSequenceResponse>(
          API_ENDPOINTS.CREATOR_SEQUENCE(creatorId),
          {
            method: "PATCH",
            body: JSON.stringify({ sequence }),
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
