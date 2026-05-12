"use client";

import { useSearchParams } from "next/navigation";
import SubscriptionSection from "@/components/Feature/Subscription";

export default function CreatorPlansClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return <SubscriptionSection setupToken={token} />;
}
