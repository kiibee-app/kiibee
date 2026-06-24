"use client";

import { useMemo } from "react";
import { API, useGetAPI } from "@/lib/http/api";

export type PayoutStats = {
  balance: string;
  purchases: number;
  rentals: number;
};

type PayoutStatsResponse = {
  data: PayoutStats;
  message: string;
  statusCode: number;
};

export const usePayoutStats = () => {
  const query = useGetAPI<PayoutStatsResponse>(API.payout.stats);

  const stats = useMemo((): PayoutStats | null => {
    return query.data?.data ?? null;
  }, [query.data]);

  return {
    stats,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
