"use client";

import { useSearchParams } from "next/navigation";
import type { AccessGateType } from "@/components/Feature/AccessGate";

import { GATE_QUERY_PARAM, TYPE_CODE, TYPE_EMAIL } from "@/utils/Constants";

export function useCollectionAccessGate(): {
  gateType: AccessGateType | null;
  isLoading: boolean;
} {
  const searchParams = useSearchParams();
  const gateParam = searchParams.get(GATE_QUERY_PARAM);

  const gateType: AccessGateType | null =
    gateParam === TYPE_CODE || gateParam === TYPE_EMAIL ? gateParam : null;

  return { gateType, isLoading: false };
}
