"use client";

import { useTranslation } from "react-i18next";
import type { ErrorFallbackProps } from "@/types/error";
import {
  Badge,
  ConsoleBlock,
  ConsoleLabel,
  Description,
  ErrorCard,
  ErrorPage,
  MessageBox,
  RetryButton,
  Title,
} from "./ErrorFallback.styles";

export default function ErrorFallback({
  error,
  resetErrorBoundary,
  title,
}: ErrorFallbackProps) {
  const { t } = useTranslation();
  const displayTitle = title ?? t("errorFallback.defaultTitle");
  const stack = error.stack ?? t("errorFallback.noStack");

  return (
    <ErrorPage>
      <ErrorCard role="alert">
        <Badge>{t("errorFallback.badge")}</Badge>
        <Title>{displayTitle}</Title>
        <Description>{t("errorFallback.description")}</Description>
        <MessageBox>
          {error.message || t("errorFallback.unknownError")}
        </MessageBox>
        <ConsoleLabel>{t("errorFallback.consoleLabel")}</ConsoleLabel>
        <ConsoleBlock>
          {`name: ${error.name}\nmessage: ${error.message}\ndigest: ${error.digest ?? "n/a"}\n\nstack:\n${stack}`}
        </ConsoleBlock>
        <RetryButton type="button" onClick={resetErrorBoundary}>
          {t("errorFallback.retryButton")}
        </RetryButton>
      </ErrorCard>
    </ErrorPage>
  );
}
