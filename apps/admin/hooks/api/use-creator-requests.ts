"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import type { ExistingCreatorsResponse } from "../../types/existing-creator";
import type { CreatorRequest } from "../../types/creator-request";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";

const CREATOR_REQUESTS_QUERY_KEY = [QUERY_KEY.CREATOR_REQUESTS];
const EXISTING_CREATORS_QUERY_KEY = [QUERY_KEY.EXISTING_CREATORS];

type CreatorActionPayload = {
  requestId: string;
};

type CreatorAction = "approve" | "reject";

const CREATOR_ACTION_ENDPOINT: Record<CreatorAction, string> = {
  approve: API_ENDPOINTS.APPROVE_CREATOR,
  reject: API_ENDPOINTS.REJECT_CREATOR,
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
        apiClient<CreatorRequest[]>(API_ENDPOINTS.ALL_CREATOR_REQUESTS),
      );

      return data ?? [];
    },
  });
}

type ExistingCreatorsQuery = {
  search?: string;
  plan?: string;
  page: number;
  limit: number;
};

export function useExistingCreators({
  search,
  plan,
  page,
  limit,
}: ExistingCreatorsQuery) {
  return useQuery({
    queryKey: [...EXISTING_CREATORS_QUERY_KEY, { search, plan, page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search && { search }),
        ...(plan && { plan }),
      });

      const data = await ensureSuccess<ExistingCreatorsResponse>(
        apiClient<ExistingCreatorsResponse>(
          `${API_ENDPOINTS.ALL_CREATORS}?${params.toString()}`,
        ),
      );

      return (
        data ?? {
          items: [],
          pagination: {
            page,
            limit,
            totalItems: 0,
            totalPages: 1,
          },
        }
      );
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
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: CREATOR_REQUESTS_QUERY_KEY,
        }),
        queryClient.invalidateQueries({
          queryKey: EXISTING_CREATORS_QUERY_KEY,
        }),
      ]);
    },
  });
}
