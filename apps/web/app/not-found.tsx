"use client";

import { useTranslation } from "react-i18next";

import {
  Actions,
  Description,
  ErrorBadge,
  Heading,
  NotFoundCard,
  NotFoundMain,
  PrimaryButton,
} from "./not-found.styles";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <NotFoundMain>
      <NotFoundCard>
        <ErrorBadge>{t("notFound.badge")}</ErrorBadge>
        <Heading>{t("notFound.title")}</Heading>
        <Description>{t("notFound.description")}</Description>

        <Actions>
          <PrimaryButton href="/">{t("notFound.backHome")}</PrimaryButton>
        </Actions>
      </NotFoundCard>
    </NotFoundMain>
  );
}
