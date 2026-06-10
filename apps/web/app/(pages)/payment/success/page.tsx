"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API } from "@/lib/http/api/endpoints";
import { useGetAPI } from "@/lib/http/api/getApi";
import { usePostAPI } from "@/lib/http/api/postApi";
import { PATHS } from "@/utils/path";
import { MonoText } from "@/components/UI/Monotext";

type OrderRecord = {
  id: string;
  status: "pending" | "completed" | "failed";
  mediaFileId?: string | null;
};

type OrderByIdResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: OrderRecord;
};

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
  const hasRequestedFallbackRef = useRef(false);

  const { data, isLoading, refetch } = useGetAPI<OrderByIdResponse>(
    orderId ? API.order.getById(orderId) : API.order.create,
    undefined,
    {
      enabled: Boolean(orderId),
      retry: 3,
      refetchInterval: (query) =>
        query.state.data?.data?.status === "completed" ? false : 1500,
    },
  );
  const confirmPaymentMutation = usePostAPI<OrderByIdResponse, void>(
    orderId ? API.order.confirmPayment(orderId) : API.order.create,
  );

  useEffect(() => {
    if (!orderId) {
      router.replace(PATHS.DASHBOARD_VIEWER);
      return;
    }

    if (isLoading) return;

    const status = data?.data?.status;
    const mediaFileId = data?.data?.mediaFileId;
    if (status === "pending" || !status) {
      return;
    }

    if (status === "failed") {
      router.replace(`${PATHS.DASHBOARD_VIEWER}?payment=failed`);
      return;
    }

    if (status === "completed" && mediaFileId) {
      router.replace(
        `${PATHS.CONTENT}/${encodeURIComponent(mediaFileId)}?payment=success`,
      );
      return;
    }

    router.replace(PATHS.DASHBOARD_VIEWER);
  }, [data?.data?.mediaFileId, data?.data?.status, isLoading, orderId, router]);

  useEffect(() => {
    if (!orderId || isLoading || hasRequestedFallbackRef.current) return;
    if (data?.data?.status !== "pending") return;

    hasRequestedFallbackRef.current = true;
    confirmPaymentMutation
      .mutateAsync(undefined)
      .then(() => refetch())
      .catch(() => {
        hasRequestedFallbackRef.current = false;
      });
  }, [confirmPaymentMutation, data?.data?.status, isLoading, orderId, refetch]);

  return (
    <div
      style={{
        minHeight: "50vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
      }}
    >
      <MonoText $use="H5_Regular">
        Confirming your payment and unlocking content...
      </MonoText>
    </div>
  );
}
