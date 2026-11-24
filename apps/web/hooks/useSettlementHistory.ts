"use client";

import { useMemo } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { API, useGetAPI } from "@/lib/http/api";
import { formatDateUSShort } from "@/utils/formatDate";
import { formatPayoutAmount } from "@/utils/payout";

export type SettlementItem = {
  feeCalculationError?: string;
  grossAmount?: string;
  platformFee?: string;
  processingFee?: string;
  saleCount?: number;
  fixedPlatformFee?: number | null;
  processingFeePercentage?: number;

  id: string;
  amount: string;
  status: string;
  creditNo: string;
  bank: string;
  date: string;
};

type BackendSettlementItem = {
  feeCalculationError?: string;
  grossAmount?: string;
  platformFee?: string;
  processingFee?: string;
  saleCount?: number;
  fixedPlatformFee?: number | null;
  processingFeePercentage?: number;

  id: string;
  amount: string;
  status: string;
  creditNo: string;
  bank: string;
  date: string;
};

type SettlementHistoryResponse = {
  data: BackendSettlementItem[];
  message: string;
  statusCode: number;
};

function toSettlementItem(item: BackendSettlementItem): SettlementItem {
  return {
    id: item.id,
    feeCalculationError: item.feeCalculationError,
    grossAmount: item.grossAmount
      ? formatPayoutAmount(item.grossAmount)
      : undefined,
    platformFee: item.platformFee
      ? formatPayoutAmount(item.platformFee)
      : undefined,
    processingFee: item.processingFee
      ? formatPayoutAmount(item.processingFee)
      : undefined,
    saleCount: item.saleCount,
    fixedPlatformFee: item.fixedPlatformFee,
    processingFeePercentage: item.processingFeePercentage,
    amount: formatPayoutAmount(item.amount),
    status: item.status,
    creditNo: item.creditNo ?? "-",
    bank: item.bank ?? "-",
    date: formatDateUSShort(item.date),
  };
}

export type SettlementSearchParams = {
  status?: string;
  search?: string;
};

export const useSettlementHistory = (searchParams?: SettlementSearchParams) => {
  const params = searchParams
    ? {
        ...(searchParams.status && { status: searchParams.status }),
        ...(searchParams.search && { search: searchParams.search }),
      }
    : undefined;

  const query = useGetAPI<SettlementHistoryResponse>(
    API.payout.settlementHistory,
    params,
    {
      placeholderData: keepPreviousData,
      refetchInterval: (query) =>
        query.state.data?.data.some(
          (row) => row.status.toLowerCase() === "pending",
        )
          ? 15000
          : false,
    },
  );

  const settlements = useMemo((): SettlementItem[] => {
    const items = query.data?.data;
    if (!Array.isArray(items)) return [];
    return items.map(toSettlementItem);
  }, [query.data]);

  return {
    settlements,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
