"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { API } from "@/lib/http/api/endpoints";
import { useGetAPI } from "@/lib/http/api/getApi";
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

  const orderId = searchParams.get("orderId");

  const { data, isLoading, isError } = useGetAPI<OrderByIdResponse>(
    orderId ? API.order.getById(orderId) : "",
    undefined,
    {
      enabled: !!orderId,
      retry: 3,
      refetchInterval: (query) => {
        const status = query.state.data?.data?.status;

        if (status === "completed" || status === "failed") {
          return false;
        }

        return 1500;
      },
    },
  );

  const order = data?.data;

  useEffect(() => {
    if (order?.status === "completed" && order.mediaFileId) {
      router.replace(
        `${PATHS.CONTENT}/${encodeURIComponent(order.mediaFileId)}`,
      );
    }
  }, [order?.status, order?.mediaFileId, router]);

  if (!orderId) {
    return (
      <div
        style={{
          minHeight: "50vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
        }}
      >
        <MonoText>Invalid order reference.</MonoText>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        style={{
          minHeight: "50vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
        }}
      >
        <MonoText>
          Unable to verify your payment. Please refresh the page.
        </MonoText>
      </div>
    );
  }

  if (order?.status === "failed") {
    return (
      <div
        style={{
          minHeight: "50vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
        }}
      >
        <MonoText>Payment was not completed. Please try again.</MonoText>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "50vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <MonoText style={{ fontSize: "18px", textAlign: "center" }}>
        {isLoading
          ? "Checking payment status..."
          : "Confirming your payment and unlocking content..."}
      </MonoText>
    </div>
  );
}
