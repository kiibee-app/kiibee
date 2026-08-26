"use client";

import { useMemo } from "react";
import { API, useGetAPI } from "@/lib/http/api";
import { FRESH_QUERY_OPTIONS } from "@/utils/common";
import type { GetCreatorProfileResponse } from "@/hooks/auth/creatorProfileApi";

const PLACEHOLDER_BANK_NAME = "Default Bank";

export function hasCompleteCreatorPaymentInfo(
  bankAccount?: {
    registrationNumber?: string | null;
    accountNumber?: string | null;
    accountHolderName?: string | null;
    bankName?: string | null;
  } | null,
): boolean {
  if (!bankAccount) return false;

  const bankName = bankAccount.bankName?.trim() ?? "";
  return Boolean(
    bankAccount.registrationNumber?.trim() &&
    bankAccount.accountNumber?.trim() &&
    bankAccount.accountHolderName?.trim() &&
    bankName &&
    bankName !== PLACEHOLDER_BANK_NAME,
  );
}

/** Whether the creator has filled profile payment (bank) information. */
export const useCreatorPaymentInfo = () => {
  const query = useGetAPI<GetCreatorProfileResponse>(
    API.auth.creatorProfile,
    undefined,
    {
      ...FRESH_QUERY_OPTIONS,
      staleTime: 0,
    },
  );

  const hasPaymentInfo = useMemo(
    () => hasCompleteCreatorPaymentInfo(query.data?.data?.bankAccount),
    [query.data?.data?.bankAccount],
  );

  return {
    hasPaymentInfo,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
