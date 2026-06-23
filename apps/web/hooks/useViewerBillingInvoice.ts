"use client";

import { API, useGetAPI } from "@/lib/http/api";

type BillingData = {
  orderNumber: string;
  type: string;
  paymentDate: string;
  amount: number | string;
  paymentMethod?: string;
  cardNumber?: string | null;
  contentDetails: {
    contentTitle?: string | null;
    contentImage?: string | null;
    creatorName?: string | null;
  };
};

type BillingInvoiceResponse = {
  data: BillingData;
  message: string;
  statusCode: number;
};

export const useViewerBillingInvoice = (billingId: string) => {
  const query = useGetAPI<BillingInvoiceResponse>(
    API.order.billingInvoice(billingId),
    undefined,
    {
      enabled: Boolean(billingId),
    },
  );

  return {
    invoice: query.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
