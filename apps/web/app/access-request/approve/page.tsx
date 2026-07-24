"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { COLORS } from "@repo/ui/colors";

import { QuestionIcon } from "@/assets/icons/questionIcon";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import Image from "@/components/UI/SafeImage";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";
import { API } from "@/lib/http/api/endpoints";
import { axiosClient } from "@/lib/http/axiosClient";
import { STATUS_TONE, type StatusTone } from "@/utils/Constants";
import {
  BrandMark,
  CardHint,
  CardMessage,
  CardTitle,
  IconRing,
  PageShell,
  Spinner,
  StatusCard,
} from "@/app/(pages)/payment/success/styles";

export default function ApproveContentAccessPage() {
  const { t } = useTranslation();
  const token = useSearchParams().get("token");
  const [state, setState] = useState<StatusTone>(
    token ? STATUS_TONE.LOADING : STATUS_TONE.ERROR,
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    let closeTimer: number | undefined;
    let cancelled = false;

    axiosClient
      .get(API.creatorUsers.approveContentAccess, { params: { token } })
      .then(() => {
        if (cancelled) return;
        setState(STATUS_TONE.SUCCESS);
        closeTimer = window.setTimeout(() => window.close(), 1200);
      })
      .catch((error) => {
        if (cancelled) return;
        setState(STATUS_TONE.ERROR);
        setErrorMessage(
          error?.response?.data?.message ||
            t("contentAccessApproval.invalidOrExpired"),
        );
      });

    return () => {
      cancelled = true;
      if (closeTimer) window.clearTimeout(closeTimer);
    };
  }, [t, token]);

  const isLoading = state === STATUS_TONE.LOADING;
  const isSuccess = state === STATUS_TONE.SUCCESS;

  return (
    <PageShell>
      <StatusCard aria-live="polite" aria-busy={isLoading}>
        <BrandMark>
          <Image
            src={logo}
            alt={t("subscriptionPage.logoAlt")}
            width={32}
            height={32}
            priority
          />
        </BrandMark>

        <IconRing
          $tone={
            isLoading
              ? STATUS_TONE.LOADING
              : isSuccess
                ? STATUS_TONE.SUCCESS
                : STATUS_TONE.ERROR
          }
        >
          {isLoading ? (
            <Spinner />
          ) : isSuccess ? (
            <SuccessModalIcon size={36} />
          ) : (
            <QuestionIcon width={36} height={36} color={COLORS.primary.RED} />
          )}
        </IconRing>

        <CardTitle>{t(`contentAccessApproval.${state}.title`)}</CardTitle>
        <CardMessage>
          {state === STATUS_TONE.ERROR
            ? errorMessage || t("contentAccessApproval.invalidLink")
            : t(`contentAccessApproval.${state}.message`)}
        </CardMessage>
        {isSuccess && (
          <CardHint>{t("contentAccessApproval.success.hint")}</CardHint>
        )}
      </StatusCard>
    </PageShell>
  );
}
