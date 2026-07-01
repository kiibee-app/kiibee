"use client";

import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { API, useGetAPI } from "@/lib/http/api";
import { axiosClient } from "@/lib/http/axiosClient";
import { CARD, CARD_BRANDS, type CardBrand } from "@/utils/Constants";
import { formatSavedCardLabel } from "@/utils/common";
import { formatCardExpiry } from "@/utils/formatDate";
import type {
  BackendPaymentMethod,
  PaymentMethodPayload,
  PaymentMethodsResponse,
  ViewerPaymentMethod,
} from "@/types/cardTypes";

export type { ViewerPaymentMethod } from "@/types/cardTypes";

function resolveCardBrand(brand?: string): CardBrand {
  if (brand?.toLowerCase() === CARD_BRANDS.MASTERCARD) {
    return CARD_BRANDS.MASTERCARD;
  }
  return CARD_BRANDS.VISA;
}

function toPaymentMethod(item: BackendPaymentMethod): ViewerPaymentMethod {
  return {
    id: item.id,
    subscriptionId: item.ePaySubscriptionId,
    brand: resolveCardBrand(item.cardType),
    label: formatSavedCardLabel(item.cardNo, item.cardType, CARD),
    cardNumber: item.cardNo,
    expiresAt: formatCardExpiry(item.expireDate),
    isDefault: item.isDefault,
  };
}

export const useViewerPaymentMethods = () => {
  const queryClient = useQueryClient();

  const query = useGetAPI<PaymentMethodsResponse>(API.payment.cards);

  const paymentMethods = useMemo((): ViewerPaymentMethod[] => {
    const items = query.data?.data;
    if (!Array.isArray(items)) return [];
    return items.map(toPaymentMethod);
  }, [query.data]);

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: [API.payment.cards],
    });

  const addCard = async (payload: PaymentMethodPayload) => {
    await axiosClient.post(API.viewer.paymentMethods, payload);
    await invalidate();
  };

  const updateCard = async (id: string, payload: PaymentMethodPayload) => {
    await axiosClient.patch(API.viewer.paymentMethod(id), payload);
    await invalidate();
  };

  const deleteCard = async (id: string) => {
    await axiosClient.delete(API.payment.card(id));
    await invalidate();
  };

  const markAsDefault = async (id: string) => {
    await axiosClient.patch(API.viewer.paymentMethodDefault(id));
    await invalidate();
  };

  return {
    paymentMethods,
    isLoading: query.isLoading,
    isError: query.isError,
    addCard,
    updateCard,
    deleteCard,
    markAsDefault,
  };
};
