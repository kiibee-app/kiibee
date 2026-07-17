"use client";

import { API, usePostAPI } from "@/lib/http/api";

export type AddPaymentCardResponse = {
  paymentWindowUrl: string;
  session?: {
    id: string;
    subscriptionId?: string | null;
    [key: string]: unknown;
  };
  key?: string;
  javascript?: string;
  qrCode?: string | null;
};

export const useAddPaymentCard = () => {
  const mutation = usePostAPI<AddPaymentCardResponse, void>(
    API.payment.cardAdd,
  );

  return {
    addHostedCard: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
