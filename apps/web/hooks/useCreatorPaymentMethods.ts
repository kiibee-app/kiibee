"use client";

import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { API, useGetAPI } from "@/lib/http/api";
import { axiosClient } from "@/lib/http/axiosClient";
import { CARD_BRANDS, type CardBrand } from "@/utils/Constants";
import type {
  CreatorPaymentMethodResponse,
  CreatorPaymentMethodsApiResponse,
  PaymentMethodPayload,
  ViewerPaymentMethod,
} from "@/types/cardTypes";

export type { ViewerPaymentMethod } from "@/types/cardTypes";

function resolveCardBrand(brand?: string): CardBrand {
  if (brand?.toLowerCase() === CARD_BRANDS.MASTERCARD) {
    return CARD_BRANDS.MASTERCARD;
  }
  return CARD_BRANDS.VISA;
}

function toPaymentMethod(
  item: CreatorPaymentMethodResponse,
): ViewerPaymentMethod {
  return {
    id: item.id,
    subscriptionId: "",
    brand: resolveCardBrand(item.brand),
    label: item.label || `**** ${item.lastFour}`,
    cardNumber: item.cardNumber,
    expiresAt: item.expiresAt,
    isDefault: item.isDefault,
  };
}

export const useCreatorPaymentMethods = () => {
  const queryClient = useQueryClient();

  const query = useGetAPI<CreatorPaymentMethodsApiResponse>(
    API.viewer.paymentMethods,
  );

  const paymentMethods = useMemo((): ViewerPaymentMethod[] => {
    const items = query.data?.data;
    if (!Array.isArray(items)) return [];
    return items.map(toPaymentMethod);
  }, [query.data]);

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: [API.viewer.paymentMethods],
    });

  const addCard = async (payload: PaymentMethodPayload) => {
    await axiosClient.post(API.viewer.paymentMethods, payload);
    await invalidate();
  };

  const deleteCard = async (id: string) => {
    await axiosClient.delete(API.viewer.paymentMethod(id));
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
    deleteCard,
    markAsDefault,
  };
};
