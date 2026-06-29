"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Image from "@/components/UI/SafeImage";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import GenericButton from "@/components/UI/GenericButton";
import { QuestionIcon } from "@/assets/icons/questionIcon";
import { COLORS } from "@repo/ui/colors";
import { PATHS } from "@/utils/path";
import {
  ActionWrap,
  BrandMark,
  CardMessage,
  CardTitle,
  IconRing,
  PageShell,
  StatusCard,
} from "../../payment/success/styles";

function SubscriptionFailureContent() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <PageShell>
      <StatusCard aria-live="polite">
        <BrandMark>
          <Image src={logo} alt="Kiibee" width={32} height={32} priority />
        </BrandMark>

        <IconRing $tone="error">
          <QuestionIcon width={36} height={36} color={COLORS.primary.RED} />
        </IconRing>

        <CardTitle>{t("subscriptionPage.failure.title")}</CardTitle>
        <CardMessage>{t("subscriptionPage.failure.message")}</CardMessage>

        <ActionWrap>
          <GenericButton onClick={() => router.replace(PATHS.PRICING)}>
            {t("subscriptionPage.failure.viewPlans")}
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
