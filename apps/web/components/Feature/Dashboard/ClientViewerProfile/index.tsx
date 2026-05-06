"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import { MonoText } from "@/components/UI/Monotext";
import { INPUT_VARIANTS, VARIANT } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";
import {
  AvatarPlaceholder,
  Container,
  Form,
  HeaderRow,
  InlineLabel,
  PasswordButton,
  PasswordRow,
  ProfileSummary,
  SaveButton,
  SummaryText,
} from "./styles";

const VIEWER_PROFILE = {
  downloads: 15,
};

export default function ClientViewerProfile() {
  const { t } = useTranslation();

  return (
    <Container>
      <HeaderRow>
        <MonoText $use="H4_Medium">
          {t("dashboard.viewerProfile.title")}
        </MonoText>
        <SaveButton variant={VARIANT.PRIMARY}>
          {t("dashboard.viewerProfile.saveChanges")}
        </SaveButton>
      </HeaderRow>

      <ProfileSummary>
        <AvatarPlaceholder
          aria-label={t("dashboard.viewerProfile.profilePhotoAlt")}
        >
          <MonoText $use="Heading2">?</MonoText>
        </AvatarPlaceholder>

        <SummaryText>
          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
            {t("dashboard.viewerProfile.downloads", {
              count: VIEWER_PROFILE.downloads,
            })}
          </MonoText>
        </SummaryText>
      </ProfileSummary>

      <Form>
        <InputField
          label={t("dashboard.viewerProfile.fullName")}
          placeholder={t("dashboard.viewerProfile.fullName")}
          variant={INPUT_VARIANTS.PRIMARY_GRAY}
          labelMarginTop="0"
        />
        <InputField
          label={t("dashboard.viewerProfile.email")}
          placeholder={t("dashboard.viewerProfile.email")}
          variant={INPUT_VARIANTS.PRIMARY_GRAY}
        />

        <PasswordRow>
          <InlineLabel>{t("creatorProfile.passwordLabel")}</InlineLabel>
          <PasswordButton variant={VARIANT.PRIMARY}>
            {t("creatorProfile.changePassword")}
          </PasswordButton>
        </PasswordRow>
      </Form>
    </Container>
  );
}
