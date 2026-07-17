"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";
import type {
  PayoutRequest,
  PayoutCreatePayload,
} from "../../types/payout-request";

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

function updatePayoutRequestCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  requestId: string,
  status: PayoutRequest["status"],
) {
  queryClient.setQueryData<PayoutRequest[]>(
    [QUERY_KEY.PAYOUT_REQUESTS],
    (requests) => requests?.filter((request) => request.id !== requestId) ?? [],
  );

  queryClient.setQueryData<PayoutRequest>(
    [QUERY_KEY.PAYOUT_REQUEST_DETAIL, requestId],
    (request) => (request ? { ...request, status } : request),
  );
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
    mutationFn: async (payload: PayoutCreatePayload) => {
      const data = await ensureSuccess(
        apiClient(API_ENDPOINTS.CREATE_PAYOUT, {
          method: "POST",
          body: JSON.stringify({
            creatorId: payload.creatorId,
            amount: payload.amount,
            payoutId: payload.payoutId,
            paymentMethodId: payload.paymentMethodId,
          }),
        }),
      );
      return data;
    },
    onSuccess: (_data, payload) => {
      updatePayoutRequestCaches(queryClient, payload.requestId, "completed");
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEY.PAYOUT_REQUESTS],
        queryFn: async () => {
          const data = await ensureSuccess<PayoutRequest[]>(
            apiClient<PayoutRequest[]>(API_ENDPOINTS.ALL_PAYOUT_REQUESTS),
          );
          return data ?? [];
        },
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.PAYOUT_REQUEST_DETAIL, payload.requestId],
      });
    },
  });
}

export function useRejectPayoutRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const data = await ensureSuccess(
        apiClient(API_ENDPOINTS.REJECT_PAYOUT_REQUEST(requestId), {
          method: "PUT",
        }),
      );
      return data;
    },
    onSuccess: (_data, requestId) => {
      updatePayoutRequestCaches(queryClient, requestId, "rejected");
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEY.PAYOUT_REQUESTS],
        queryFn: async () => {
          const data = await ensureSuccess<PayoutRequest[]>(
            apiClient<PayoutRequest[]>(API_ENDPOINTS.ALL_PAYOUT_REQUESTS),
          );
          return data ?? [];
        },
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.PAYOUT_REQUEST_DETAIL, requestId],
      });
    },
  });
}
