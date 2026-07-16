"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Image from "@/components/UI/SafeImage";
import { QuestionIcon } from "@/assets/icons/questionIcon";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import { COLORS } from "@repo/ui/colors";
import { STATUS_TONE } from "@/utils/Constants";
import {
  BrandMark,
  CardHint,
  CardMessage,
  CardTitle,
  IconRing,
  PageShell,
  ProgressDot,
  ProgressDots,
  StatusCard,
} from "../../payment/success/styles";

const PAYOUT_METHODS_PATH =
  "/dashboard/creators?view=Settings&tab=payoutMethods&card=failure";

export default function CardFailurePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace(PAYOUT_METHODS_PATH);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <PageShell>
      <StatusCard aria-live="polite">
        <BrandMark>
          <Image src={logo} alt="Kiibee" width={32} height={32} priority />
        </BrandMark>
        <IconRing $tone={STATUS_TONE.ERROR}>
          <QuestionIcon width={36} height={36} color={COLORS.primary.RED} />
        </IconRing>
        <CardTitle>Card was not added</CardTitle>
        <CardMessage>
          The card setup was not completed. We are taking you back to payout
          methods.
        </CardMessage>
        <CardHint>You can try adding the card again from settings.</CardHint>
        <ProgressDots aria-hidden="true">
          <ProgressDot $active />
          <ProgressDot />
          <ProgressDot />
        </ProgressDots>
      </StatusCard>
    </PageShell>
  );
}
