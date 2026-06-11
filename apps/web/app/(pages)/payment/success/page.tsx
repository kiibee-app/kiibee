"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { API } from "@/lib/http/api/endpoints";
import { useGetAPI } from "@/lib/http/api/getApi";
import { PATHS } from "@/utils/path";
import {
  COMPLETED,
  FAILED,
  PAYMENT_QUERY_KEY,
  STATUS_TONE,
} from "@/utils/Constants";
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
} from "./styles";

type OrderRecord = {
  id: string;
  status: "pending" | "completed" | "failed";
  mediaFileId?: string | null;
};

type OrderByIdResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: OrderRecord;
};

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId") ?? searchParams.get("orderid");

  const { data, isLoading, isError } = useGetAPI<OrderByIdResponse>(
    orderId ? API.order.getById(orderId) : "",
    undefined,
    {
      enabled: !!orderId,
      retry: 3,
      refetchInterval: (query) => {
        const status = query.state.data?.data?.status;

        if (status === COMPLETED || status === FAILED) {
          return false;
        }

        return 1500;
      },
    },
  );

  const order = data?.data;
  const isVerifying = isLoading || !order;
  const isUnlocking = Boolean(
    order && order.status !== COMPLETED && order.status !== FAILED,
  );

  useEffect(() => {
    if (order?.status === COMPLETED && order.mediaFileId) {
      const paymentParams = new URLSearchParams({
        [PAYMENT_QUERY_KEY]: STATUS_TONE.SUCCESS,
      });
      router.replace(
        `${PATHS.CONTENT}/${encodeURIComponent(order.mediaFileId)}?${paymentParams.toString()}`,
      );
    }
  }, [order?.status, order?.mediaFileId, router]);

  if (!orderId) {
    return (
      <PageShell>
        <StatusCard aria-live="polite">
          <BrandMark>
            <Image src={logo} alt="Kiibee" width={32} height={32} priority />
          </BrandMark>
          <IconRing $tone={STATUS_TONE.ERROR}>
            <QuestionIcon width={36} height={36} color={COLORS.primary.RED} />
          </IconRing>
          <CardTitle>Invalid payment link</CardTitle>
          <CardMessage>
            We couldn&apos;t find your order. Please return to the content page
            and try again.
          </CardMessage>
          <ActionWrap>
            <GenericButton onClick={() => router.replace(PATHS.HOME)}>
              Go to Home
            </GenericButton>
          </ActionWrap>
        </StatusCard>
      </PageShell>
    );
  }

  if (isError) {
    return (
      <PageShell>
        <StatusCard aria-live="polite">
          <BrandMark>
            <Image src={logo} alt="Kiibee" width={32} height={32} priority />
          </BrandMark>
          <IconRing $tone={STATUS_TONE.ERROR}>
            <QuestionIcon width={36} height={36} color={COLORS.primary.RED} />
          </IconRing>
          <CardTitle>Unable to verify payment</CardTitle>
          <CardMessage>
            Something went wrong while checking your payment. Please refresh the
            page or try again in a moment.
          </CardMessage>
          <ActionWrap>
            <GenericButton onClick={() => window.location.reload()}>
              Refresh page
            </GenericButton>
          </ActionWrap>
        </StatusCard>
      </PageShell>
    );
  }

  if (order?.status === FAILED) {
    return (
      <PageShell>
        <StatusCard aria-live="polite">
          <BrandMark>
            <Image src={logo} alt="Kiibee" width={32} height={32} priority />
          </BrandMark>
          <IconRing $tone={STATUS_TONE.ERROR}>
            <QuestionIcon width={36} height={36} color={COLORS.primary.RED} />
          </IconRing>
          <CardTitle>Payment not completed</CardTitle>
          <CardMessage>
            Your payment was not successful and no charges were made. You can
            try again from the content page.
          </CardMessage>
          <ActionWrap>
            <GenericButton onClick={() => router.replace(PATHS.EXPLORE)}>
              Go to Explore
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
          $tone={isUnlocking ? STATUS_TONE.SUCCESS : STATUS_TONE.LOADING}
        >
          {isUnlocking ? <SuccessModalIcon size={36} /> : <Spinner />}
        </IconRing>

        <CardTitle>Payment successful</CardTitle>
        <CardMessage>
          {isVerifying
            ? "Checking your payment status..."
            : "Unlocking your content now. You will be redirected shortly."}
        </CardMessage>
        <CardHint>
          This usually takes a few seconds. Please keep this page open.
        </CardHint>

        <ProgressDots aria-hidden="true">
          <ProgressDot $active={!isVerifying} />
          <ProgressDot $active={isUnlocking} />
          <ProgressDot $active={false} />
        </ProgressDots>
      </StatusCard>
    </PageShell>
  );
}
