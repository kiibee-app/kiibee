"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";
import type { PayoutRequest } from "../../types/payout-request";

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

export function usePayoutRequests() {
  return useQuery({
    queryKey: [QUERY_KEY.PAYOUT_REQUESTS],
    queryFn: async () => {
      const data = await ensureSuccess<PayoutRequest[]>(
        apiClient<PayoutRequest[]>(API_ENDPOINTS.ALL_PAYOUT_REQUESTS),
      );
      return data ?? [];
    },
  });
}

export function usePayoutRequest(id: string) {
  return useQuery({
    queryKey: [QUERY_KEY.PAYOUT_REQUEST_DETAIL, id],
    queryFn: async () => {
      const data = await ensureSuccess<PayoutRequest>(
        apiClient<PayoutRequest>(API_ENDPOINTS.PAYOUT_REQUEST_BY_ID(id)),
      );
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      creatorId: string;
      amount: string;
      payoutId: string;
      paymentMethodId: string;
    }) => {
      const data = await ensureSuccess(
        apiClient(API_ENDPOINTS.CREATE_PAYOUT, {
          method: "POST",
          body: JSON.stringify(payload),
        }),
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.PAYOUT_REQUESTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.PAYOUT_REQUEST_DETAIL],
      });
    },
  });
}
