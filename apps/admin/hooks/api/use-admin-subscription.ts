"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";
import { toast } from "react-hot-toast";

export interface AdminSubscriptionOverrides {
  id: string;
  planId: string;
  creatorId: string;
  status: string;
  customPrice: number | null;
  customPrice3: number | null;
  customPrice6: number | null;
  customPrice12: number | null;
  customMaxFiles: number | null;
  customKiibeeCutDkk: number | null;
  customTransactionFeePct: number | null;
  paymentPeriod: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSubscriptionData {
  plan: {
    id: string;
    name: string;
    price: number;
    currency: string;
    billingCycle: string;
    maxFiles: number;
  };
  overrides?: AdminSubscriptionOverrides | null;
}

export function useAdminSubscription(creatorId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEY.ADMIN_SUBSCRIPTION, creatorId],
    enabled: Boolean(creatorId),
    queryFn: async () => {
      const response = await apiClient<AdminSubscriptionData>(
        API_ENDPOINTS.ADMIN_GET_SUBSCRIPTION(creatorId as string),
      );

      if (!response.success) {
        throw new Error(response.message || "Request failed");
      }

      return response.data;
    },
  });
}

export interface PlanData {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: string;
  maxFiles: number;
  paymentPeriod: string;
}

export function useAllPlans() {
  return useQuery({
    queryKey: [QUERY_KEY.ALL_PLANS],
    queryFn: async () => {
      const response = await apiClient<PlanData[]>(API_ENDPOINTS.ALL_PLANS);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch plans");
      }
      return response.data;
    },
  });
}

export interface UpdateAdminSubscriptionPayload {
  planId: string;
  customPrice: number | null;
  customPrice3: number | null;
  customPrice6: number | null;
  customPrice12: number | null;
  customMaxFiles: number | null;
  customKiibeeCutDkk: number | null;
  customTransactionFeePct: number | null;
  paymentPeriod: string | null;
}

export function useUpdateAdminSubscription(creatorId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateAdminSubscriptionPayload) => {
      if (!creatorId) throw new Error("Missing creator ID");

      const response = await apiClient(
        API_ENDPOINTS.ADMIN_UPDATE_SUBSCRIPTION(creatorId),
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to update subscription");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.ADMIN_SUBSCRIPTION, creatorId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.CREATOR_DETAIL, creatorId],
      });
      toast.success("Subscription settings updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
