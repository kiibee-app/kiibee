"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FAILED, PAYMENT_QUERY_KEY } from "@/utils/Constants";
import { PATHS } from "@/utils/path";

function PaymentFailureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? searchParams.get("orderid");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (orderId) {
        const paymentParams = new URLSearchParams({
          [PAYMENT_QUERY_KEY]: FAILED,
        });
        router.replace(`${PATHS.DASHBOARD_VIEWER}?${paymentParams.toString()}`);
        return;
      }
      router.replace(PATHS.DASHBOARD_VIEWER);
    }, 1200);

    return () => clearTimeout(timer);
  }, [orderId, router]);

  return null;
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={null}>
      <PaymentFailureContent />
    </Suspense>
  );
}
