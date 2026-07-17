"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
          <Image
            src={logo}
            alt={t("subscriptionPage.logoAlt")}
            width={32}
            height={32}
            priority
          />
        </BrandMark>
        <IconRing $tone={STATUS_TONE.SUCCESS}>
          <SuccessModalIcon size={36} />
        </IconRing>
        <CardTitle>{t("cardSuccessPage.title")}</CardTitle>
        <CardMessage>{t("cardSuccessPage.message")}</CardMessage>
        <CardHint>{t("cardSuccessPage.hint")}</CardHint>
        <ProgressDots aria-hidden="true">
          <ProgressDot $active />
          <ProgressDot $active />
          <ProgressDot />
        </ProgressDots>
      </StatusCard>
    </PageShell>
  );
}
