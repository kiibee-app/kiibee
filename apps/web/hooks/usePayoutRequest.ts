"use client";

import { useQueryClient } from "@tanstack/react-query";
import { API, usePostAPI } from "@/lib/http/api";

export type PayoutRequestPayload = {
  amount: number;
  paymentMethodId: string;
};

export type PayoutRequestResult = {
  payoutId: string;
  payoutRequestId: string;
  amount: number;
  planPrice: number;
  platformFeePercentage: number;
  processingFeePercentage: number;
  platformFee: number;
  processingFee: number;
  payableAmount: number;
};

type PayoutRequestResponse = {
  data: PayoutRequestResult;
  message: string;
  statusCode: number;
};

export const usePayoutRequest = () => {
  const queryClient = useQueryClient();

  const mutation = usePostAPI<PayoutRequestResponse, PayoutRequestPayload>(
    API.payout.request,
  );

  const requestPayout = async (payload: PayoutRequestPayload) => {
    const response = await mutation.mutateAsync(payload);

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [API.payout.stats] }),
      queryClient.invalidateQueries({
        queryKey: [API.payout.settlementHistory],
      }),
      queryClient.invalidateQueries({ queryKey: [API.payout.calculate] }),
    ]);

    return response;
  };

  return {
    requestPayout,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
