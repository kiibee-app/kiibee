"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { API } from "@/lib/http/api/endpoints";
import { useGetAPI } from "@/lib/http/api/getApi";
import { PATHS } from "@/utils/path";
import { STATUS_TONE } from "@/utils/Constants";
import Image from "@/components/UI/SafeImage";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import GenericButton from "@/components/UI/GenericButton";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";
import { QuestionIcon } from "@/assets/icons/questionIcon";
import { COLORS } from "@repo/ui/colors";
import {
  ActionWrap,
  BrandMark,
  CardHint,
  CardMessage,
  CardTitle,
  IconRing,
  PageShell,
  ProgressDot,
  ProgressDots,
  Spinner,
  StatusCard,
} from "../../payment/success/styles";

type CreatorPlanRecord = {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
};

type CreatorPlanResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: CreatorPlanRecord[];
};

function SubscriptionSuccessContent() {
  const { t } = useTranslation();
  const router = useRouter();

  const { data, isLoading, isError } = useGetAPI<CreatorPlanResponse>(
    API.subscription.creatorPlan,
    undefined,
    {
      retry: 5,
      refetchInterval: (query) => {
        const plan = query.state.data?.data?.[0];

        if (plan?.isActive && plan.price > 0) {
          return false;
        }

        return 1500;
      },
    },
  );

  const plan = data?.data?.[0];
  const isActivePaid = Boolean(plan?.isActive && plan.price > 0);
  const isVerifying = isLoading || !plan;

  useEffect(() => {
    if (isActivePaid) {
      const timer = setTimeout(() => {
        router.replace(PATHS.DASHBOARD_CREATOR);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isActivePaid, router]);

  if (isError) {
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
          <IconRing $tone={STATUS_TONE.ERROR}>
            <QuestionIcon width={36} height={36} color={COLORS.primary.RED} />
          </IconRing>
          <CardTitle>
            {t("subscriptionPage.success.verifyErrorTitle")}
          </CardTitle>
          <CardMessage>{t("subscriptionPage.success.verifyError")}</CardMessage>
          <ActionWrap>
            <GenericButton onClick={() => window.location.reload()}>
              {t("subscriptionPage.success.refreshPage")}
            </GenericButton>
          </ActionWrap>
        </StatusCard>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <StatusCard aria-live="polite" aria-busy="true">
        <BrandMark>
          <Image src={logo} alt="Kiibee" width={32} height={32} priority />
        </BrandMark>

        <IconRing
          $tone={isActivePaid ? STATUS_TONE.SUCCESS : STATUS_TONE.LOADING}
        >
          {isActivePaid ? <SuccessModalIcon size={36} /> : <Spinner />}
        </IconRing>

        <CardTitle>{t("subscriptionPage.success.title")}</CardTitle>
        <CardMessage>
          {isVerifying
            ? t("subscriptionPage.success.checking")
            : t("subscriptionPage.success.unlocking")}
        </CardMessage>
        <CardHint>{t("subscriptionPage.success.hint")}</CardHint>

        <ProgressDots aria-hidden="true">
          <ProgressDot $active={!isVerifying} />
          <ProgressDot $active={isActivePaid} />
          <ProgressDot $active={false} />
        </ProgressDots>

        {isActivePaid && (
          <ActionWrap>
            <GenericButton
              onClick={() => router.replace(PATHS.DASHBOARD_CREATOR)}
            >
              {t("subscriptionPage.success.goToDashboard")}
            </GenericButton>
          </ActionWrap>
        )}
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
