"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { API, useGetAPI } from "@/lib/http/api";
import { axiosClient } from "@/lib/http/axiosClient";
import { CARD, CARD_BRANDS, type CardBrand } from "@/utils/Constants";
import { formatSavedCardLabel } from "@/utils/common";
import { formatCardExpiry } from "@/utils/formatDate";
import type {
  BackendPaymentMethod,
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
    paymentMethodId: item.paymentMethodId,
    subscriptionId: item.ePaySubscriptionId,
    brand: resolveCardBrand(item.cardType),
    label: formatSavedCardLabel(item.cardNo, item.cardType, CARD),
    cardNumber: item.cardNo,
    expiresAt: formatCardExpiry(item.expireDate),
    isDefault: item.isDefault,
  };
}

export const useCreatorPaymentMethods = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const cardStatus = searchParams.get("card");

  const query = useGetAPI<PaymentMethodsResponse>(
    API.payment.cards,
    undefined,
    {
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      staleTime: 0,
    },
  );
  const { refetch } = query;

  useEffect(() => {
    if (cardStatus !== "success") return;

    refetch();

    const intervalId = window.setInterval(() => {
      refetch();
    }, 1500);
    const timeoutId = window.setTimeout(() => {
      window.clearInterval(intervalId);
    }, 12000);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [cardStatus, refetch]);

  const paymentMethods = useMemo((): ViewerPaymentMethod[] => {
    const items = query.data?.data;
    if (!Array.isArray(items)) return [];
    return items.map(toPaymentMethod);
  }, [query.data]);

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: [API.payment.cards],
    });

  const addCard = async () => {
    await invalidate();
  };

  const deleteCard = async (subscriptionId: string) => {
    await axiosClient.delete(API.payment.card(subscriptionId));
    await invalidate();
  };

  const markAsDefault = async (id: string) => {
    await axiosClient.put(API.payment.cardDefault(id));
    await invalidate();
  };

  return {
    paymentMethods,
    isLoading: query.isLoading,
    isError: query.isError,
    addCard,
    deleteCard,
    markAsDefault,
    refetch,
  };
};
