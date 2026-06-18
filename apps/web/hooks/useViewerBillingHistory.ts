"use client";

import { useMemo } from "react";
import { keepPreviousData } from "@tanstack/react-query";
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
import { resolvePublicMediaUrl } from "@/utils/media";

type BackendBillingItem = {
  id: string;
  orderNumber: string;
  contentTitle: string;
  contentImage?: string | null;
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
    contentImage: resolvePublicMediaUrl(item.contentImage) ?? "",
    creatorName: item.creatorName ?? "",
    type: resolveDisplayType(item.type),
    paymentDate: formatDateUSShort(item.paymentDate),
    amount: `${item.amount} kr`,
    paymentMethod: {
      brand: resolveCardBrand(item.paymentMethod),
      last4: item.cardNumber ? item.cardNumber.slice(-3) : "",
    },
  };
}

export type BillingHistorySearchParams = {
  searchContent?: string;
  searchCreator?: string;
};

export const useViewerBillingHistory = (
  searchParams?: BillingHistorySearchParams,
) => {
  const params = searchParams
    ? {
        ...(searchParams.searchContent && {
          searchContent: searchParams.searchContent,
        }),
        ...(searchParams.searchCreator && {
          searchCreator: searchParams.searchCreator,
        }),
      }
    : undefined;

  const query = useGetAPI<BillingHistoryResponse>(
    API.order.billingHistory,
    params,
    {
      placeholderData: keepPreviousData,
    },
  );

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
