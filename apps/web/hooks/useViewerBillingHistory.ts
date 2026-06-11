"use client";

import { useMemo } from "react";
import { API, useGetAPI } from "@/lib/http/api";
import { BILLING_TYPES, CARD_BRANDS, type CardBrand } from "@/utils/Constants";

export type ViewerBillingHistoryItem = {
  id: string;
  orderNumber: string;
  contentTitle: string;
  contentImage: string;
  creatorName: string;
  type: string;
  paymentDate: string;
  amount: string;
  paymentMethod: {
    brand: CardBrand;
    last4: string;
  };
};
import { formatDateUSShort } from "@/utils/formatDate";

type BackendBillingItem = {
  id: string;
  orderNumber: string;
  contentTitle: string;
  creatorName: string;
  type: string;
  paymentDate: string;
  amount: number | string;
  paymentMethod: string;
  cardNumber: string;
};

type BillingHistoryResponse = {
  data: BackendBillingItem[];
  message: string;
  statusCode: number;
};

function resolveDisplayType(type: string): string {
  const lower = type.toLowerCase();
  if (lower === BILLING_TYPES.RENTED.value) return BILLING_TYPES.RENTED.label;
  if (lower === BILLING_TYPES.PURCHASED.value)
    return BILLING_TYPES.PURCHASED.label;
  return type;
}

function resolveCardBrand(paymentMethod?: string): CardBrand {
  const lower = paymentMethod?.toLowerCase() ?? "";
  if (lower.includes(CARD_BRANDS.MASTERCARD)) return CARD_BRANDS.MASTERCARD;
  return CARD_BRANDS.VISA;
}

function toBillingHistoryItem(
  item: BackendBillingItem,
): ViewerBillingHistoryItem {
  return {
    id: item.id,
    orderNumber: item.orderNumber ?? "",
    contentTitle: item.contentTitle ?? "",
    contentImage: "",
    creatorName: item.creatorName ?? "",
    type: resolveDisplayType(item.type),
    paymentDate: formatDateUSShort(item.paymentDate),
    amount: `${item.amount} kr`,
    paymentMethod: {
      brand: resolveCardBrand(item.paymentMethod),
      last4: item.cardNumber || "",
    },
  };
}

export const useViewerBillingHistory = () => {
  const query = useGetAPI<BillingHistoryResponse>(API.order.billingHistory);

  const billingHistory = useMemo((): ViewerBillingHistoryItem[] => {
    const items = query.data?.data;
    if (!Array.isArray(items)) return [];
    return items.map(toBillingHistoryItem);
  }, [query.data]);

  return {
    billingHistory,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
