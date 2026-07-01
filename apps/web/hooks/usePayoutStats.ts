"use client";

import { useMemo } from "react";
import { API, useGetAPI } from "@/lib/http/api";
import { formatPayoutAmount } from "@/utils/payout";

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
    const data = query.data?.data;
    if (!data) return null;

    return {
      ...data,
      balance: formatPayoutAmount(data.balance),
    };
  }, [query.data]);

  return {
    stats,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
