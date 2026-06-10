"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PATHS } from "@/utils/path";

export default function PaymentFailurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (orderId) {
        router.replace(`${PATHS.DASHBOARD_VIEWER}?payment=failed`);
        return;
      }
      router.replace(PATHS.DASHBOARD_VIEWER);
    }, 1200);

    return () => clearTimeout(timer);
  }, [orderId, router]);

  return null;
}
