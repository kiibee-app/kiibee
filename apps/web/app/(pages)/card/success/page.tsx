"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Image from "@/components/UI/SafeImage";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
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
  "/dashboard/creators?view=Settings&tab=payoutMethods&card=success";

export default function CardSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace(PAYOUT_METHODS_PATH);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <PageShell>
      <StatusCard aria-live="polite">
        <BrandMark>
          <Image src={logo} alt="Kiibee" width={32} height={32} priority />
        </BrandMark>
        <IconRing $tone={STATUS_TONE.SUCCESS}>
          <SuccessModalIcon size={36} />
        </IconRing>
        <CardTitle>Card added successfully</CardTitle>
        <CardMessage>
          Your card has been added. We are taking you back to payout methods.
        </CardMessage>
        <CardHint>This usually takes a few seconds.</CardHint>
        <ProgressDots aria-hidden="true">
          <ProgressDot $active />
          <ProgressDot $active />
          <ProgressDot />
        </ProgressDots>
      </StatusCard>
    </PageShell>
  );
}
