"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import type { CreatorDeletionRequest } from "../../types/creator-deletion-request";
import type { CreatorDeletionRequestAction } from "../../types/deletion-requests-table";
import {
  API_ENDPOINTS,
  CREATOR_DELETION_REQUEST_ACTION,
  QUERY_KEY,
} from "../../utils/constants";

const CREATOR_DELETION_REQUESTS_QUERY_KEY = [
  QUERY_KEY.CREATOR_DELETION_REQUESTS,
];

type CreatorDeletionRequestActionPayload = {
  requestId: string;
};

const CREATOR_DELETION_REQUEST_ACTION_ENDPOINT: Record<
  CreatorDeletionRequestAction,
  string
> = {
  [CREATOR_DELETION_REQUEST_ACTION.APPROVE]:
    API_ENDPOINTS.APPROVE_CREATOR_DELETION,
  [CREATOR_DELETION_REQUEST_ACTION.REJECT]:
    API_ENDPOINTS.REJECT_CREATOR_DELETION,
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

export function useCreatorDeletionRequests() {
  return useQuery({
    queryKey: CREATOR_DELETION_REQUESTS_QUERY_KEY,
    queryFn: async () => {
      const data = await ensureSuccess<CreatorDeletionRequest[]>(
        apiClient<CreatorDeletionRequest[]>(
          API_ENDPOINTS.CREATOR_DELETION_REQUESTS,
        ),
      );

      return data ?? [];
    },
  });
}

export function useCreatorDeletionRequestAction(
  action: CreatorDeletionRequestAction,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatorDeletionRequestActionPayload) =>
      ensureSuccess(
        apiClient(CREATOR_DELETION_REQUEST_ACTION_ENDPOINT[action], {
          method: "POST",
          body: JSON.stringify(payload),
        }),
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: CREATOR_DELETION_REQUESTS_QUERY_KEY,
      });
    },
  });
}
