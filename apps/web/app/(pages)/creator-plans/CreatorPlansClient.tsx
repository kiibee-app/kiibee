"use client";

import { useSearchParams } from "next/navigation";
import SubscriptionSection from "@/components/Feature/Subscription";
import { SUBSCRIPTION_STEP } from "@/utils/Constants";
import type { SubscriptionStep } from "@/types/subscription";

export default function CreatorPlansClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const stepParam = searchParams.get("step");
  const planParam = searchParams.get("plan");

  const initialStep: SubscriptionStep =
    stepParam === SUBSCRIPTION_STEP.DETAILS
      ? SUBSCRIPTION_STEP.DETAILS
      : SUBSCRIPTION_STEP.PLAN;

  return (
    <SubscriptionSection
      setupToken={token}
      initialStep={initialStep}
      initialPlanId={planParam}
    />
  );
}
