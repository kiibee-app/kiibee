"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "@/components/UI/SafeImage";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import GenericButton from "@/components/UI/GenericButton";
import { QuestionIcon } from "@/assets/icons/questionIcon";
import { COLORS } from "@repo/ui/colors";
import { PATHS } from "@/utils/path";
import {
  PageShell,
  StatusCard,
  BrandMark,
  IconRing,
  CardTitle,
  CardMessage,
  ActionWrap,
} from "../../payment/success/styles";

function SubscriptionFailureContent() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(PATHS.DASHBOARD_CREATOR);
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <PageShell>
      <StatusCard aria-live="polite">
        <BrandMark>
          <Image src={logo} alt="Kiibee" width={32} height={32} priority />
        </BrandMark>

        <IconRing $tone="error">
          <QuestionIcon width={36} height={36} color={COLORS.primary.RED} />
        </IconRing>

        <CardTitle>Payment not completed</CardTitle>
        <CardMessage>
          Your payment was not successful and no charges were made. You can try
          again from your dashboard.
        </CardMessage>

        <ActionWrap>
          <GenericButton
            onClick={() => router.replace(PATHS.DASHBOARD_CREATOR)}
          >
            Go to Dashboard
          </GenericButton>
        </ActionWrap>
      </StatusCard>
    </PageShell>
  );
}

export default function SubscriptionFailurePage() {
  return (
    <Suspense fallback={null}>
      <SubscriptionFailureContent />
    </Suspense>
  );
}
