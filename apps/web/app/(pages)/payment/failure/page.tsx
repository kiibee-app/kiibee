"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FAILED, PAYMENT_QUERY_KEY } from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import { consumePaymentReturnUrl } from "@/utils/paymentReturn";

function PaymentFailureContent() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const redirectUrl = consumePaymentReturnUrl(
        PATHS.DASHBOARD_VIEWER,
        PAYMENT_QUERY_KEY,
        FAILED,
      );
      router.replace(redirectUrl);
    }, 1200);

    return () => clearTimeout(timer);
  }, [router]);

  return null;
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={null}>
      <PaymentFailureContent />
    </Suspense>
  );
}
