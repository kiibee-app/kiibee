"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import type { DashboardStats } from "../../types/dashboard-stats";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";

const DASHBOARD_STATS_QUERY_KEY = [QUERY_KEY.DASHBOARD_STATS];

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

export function useDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_STATS_QUERY_KEY,
    queryFn: async () => {
      const data = await ensureSuccess<DashboardStats>(
        apiClient<DashboardStats>(API_ENDPOINTS.DASHBOARD_STATS),
      );

      return (
        data ?? {
          totalUsers: 0,
          creators: 0,
          viewers: 0,
          pendingRequests: 0,
          totalContent: 0,
          freeContent: 0,
          paidContent: 0,
        }
      );
    },
  });
}
