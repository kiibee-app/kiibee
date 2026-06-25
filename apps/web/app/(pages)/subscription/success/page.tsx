"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "@/components/UI/SafeImage";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import GenericButton from "@/components/UI/GenericButton";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";
import { PATHS } from "@/utils/path";
import {
  PageShell,
  StatusCard,
  BrandMark,
  IconRing,
  CardTitle,
  CardMessage,
  CardHint,
  ActionWrap,
  ProgressDots,
  ProgressDot,
} from "../../payment/success/styles";

function SubscriptionSuccessContent() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRedirecting(true);
      router.replace(PATHS.DASHBOARD_CREATOR);
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <PageShell>
      <StatusCard aria-live="polite">
        <BrandMark>
          <Image src={logo} alt="Kiibee" width={32} height={32} priority />
        </BrandMark>

        <IconRing $tone="success">
          <SuccessModalIcon size={36} />
        </IconRing>

        <CardTitle>Payment successful</CardTitle>
        <CardMessage>
          Your subscription is now active. You will be redirected to your
          dashboard shortly.
        </CardMessage>
        <CardHint>
          This usually takes a few seconds. Please keep this page open.
        </CardHint>

        <ProgressDots aria-hidden="true">
          <ProgressDot $active />
          <ProgressDot $active={redirecting} />
          <ProgressDot $active={false} />
        </ProgressDots>

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

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SubscriptionSuccessContent />
    </Suspense>
  );
}
