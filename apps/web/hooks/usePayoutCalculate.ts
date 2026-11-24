"use client";

import { useMemo } from "react";
import { API, useGetAPI } from "@/lib/http/api";

export type PayoutCalculation = {
  amount: number;
  walletBalance: number;
  walletCurrency: string;
  planPrice: number;
  fixedPlatformFee?: number | null;
  saleCount?: number;
  purchases?: number;
  rentals?: number;
  platformFeePercentage: number;
  processingFeePercentage: number;
  platformFee: number;
  processingFee: number;
  payableAmount: number;
};

type PayoutCalculateResponse = {
  data: PayoutCalculation;
  message: string;
  statusCode: number;
};

export const usePayoutCalculate = (enabled: boolean) => {
  const query = useGetAPI<PayoutCalculateResponse>(
    API.payout.calculate,
    undefined,
    {
      enabled,
      retry: false,
      staleTime: 0,
      refetchOnMount: "always",
      refetchInterval: enabled ? 15000 : false,
    },
  );

  const calculation = useMemo((): PayoutCalculation | null => {
    return query.data?.data ?? null;
  }, [query.data]);

  return {
    calculation,
    isLoading: query.isLoading || query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
