"use client";

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import { MonoText } from "@/components/UI/Monotext";
import { INPUT_VARIANTS, VARIANT } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";
import {
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
import ImageUploader from "@/components/Feature/Dashboard/CreatorProfile/ImageUploader";
import { GenericModal } from "@/components/UI/Modals";
import { MODAL_ALIGN } from "@/utils/ui";
import { CREATOR_PROFILE } from "@/utils/translationKeys";
import PasswordSection from "../CreatorProfile/PasswordSection";
import { useViewerProfile } from "@/hooks/useViewerProfile";
import { SuccessArcIcon } from "@/assets/icons";
import { useRouter } from "next/navigation";
import { VIEWER_PROFILE_FIELDS } from "@/utils/profile";
import { PATHS } from "@/utils/path";

export default function ClientViewerProfile() {
  const { t } = useTranslation();
  const router = useRouter();

  const getInitial = useCallback((name: string, email: string) => {
    const trimmed = name.trim();
    if (trimmed) return trimmed.charAt(0).toUpperCase();
    return email ? email.charAt(0).toUpperCase() : "?";
  }, []);

  const {
    form,
    avatarImage,
    setAvatarImage,
    downloadsCount,
    isProfileChanged,
    passwords,
    showPassword,
    setShowPassword,
    onChange,
    onPasswordChange,
    showPasswordSuccessModal,
    setShowPasswordSuccessModal,
    showProfileSavedModal,
    setShowProfileSavedModal,
    handleSave,
    handlePasswordClose,
    handlePasswordSave,
    isPasswordFormValid,
    isSavingProfile,
  } = useViewerProfile();

  return (
    <Container>
      <HeaderRow>
        <MonoText $use="H4_Medium">
          {t("dashboard.viewerProfile.title")}
        </MonoText>
        <SaveButton
          variant={VARIANT.PRIMARY}
          onClick={() => void handleSave()}
          disabled={!isProfileChanged || isSavingProfile}
        >
          {t("dashboard.viewerProfile.saveChanges")}
        </SaveButton>
      </HeaderRow>

      <ProfileSummary>
        <ImageUploader
          image={avatarImage}
          fallback={getInitial(form.name, form.email)}
          alt={t("dashboard.viewerProfile.profilePhotoAlt")}
          uploadTitle={t("creatorProfile.uploadPhotoTitle")}
          editTitle={t("creatorProfile.editPhotoTitle")}
          onChange={setAvatarImage}
        />

        <SummaryText>
          <MonoText $use="Heading3" color={COLORS.primary.BLACK}>
            {form.name}
          </MonoText>
          <MonoText $use="Body_Regular" color={COLORS.neutral.GRAY}>
            {form.email}
          </MonoText>
          <MonoText $use="Body_Regular" color={COLORS.neutral.GRAY}>
            {t("dashboard.viewerProfile.downloads", {
              count: downloadsCount,
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
          value={form.name}
          onChange={onChange(VIEWER_PROFILE_FIELDS.NAME)}
        />
        <InputField
          label={t("dashboard.viewerProfile.email")}
          placeholder={t("dashboard.viewerProfile.email")}
          variant={INPUT_VARIANTS.PRIMARY_GRAY}
          value={form.email}
          onChange={onChange(VIEWER_PROFILE_FIELDS.EMAIL)}
        />

        <PasswordRow>
          <InlineLabel>{t("creatorProfile.passwordLabel")}</InlineLabel>
          <PasswordButton
            variant={VARIANT.PRIMARY}
            onClick={() => setShowPassword(true)}
          >
            {t("creatorProfile.changePassword")}
          </PasswordButton>
        </PasswordRow>
      </Form>
      <GenericModal
        visible={showPassword}
        title={t(CREATOR_PROFILE.changePassword)}
        textAlign={MODAL_ALIGN.START}
        confirmLabel={t(CREATOR_PROFILE.changePassword)}
        cancelLabel={t("creatorProfile.forgotPass")}
        onClose={handlePasswordClose}
        onCancel={handlePasswordClose}
        onConfirm={handlePasswordSave}
        size="md"
        fullWidthButtons
        buttonRow
        confirmDisabled={!isPasswordFormValid}
      >
        <PasswordSection
          passwords={passwords}
          onPasswordChange={onPasswordChange}
        />
      </GenericModal>
      <GenericModal
        visible={showProfileSavedModal}
        title={t("dashboard.viewerProfile.saveModalTitle")}
        message={t("dashboard.viewerProfile.saveModalMessage")}
        confirmLabel={t("dashboard.viewerProfile.saveModalDone")}
        onClose={() => setShowProfileSavedModal(false)}
        onConfirm={() => setShowProfileSavedModal(false)}
        width="480px"
        showCloseButton={false}
      />
      <GenericModal
        visible={showPasswordSuccessModal}
        icon={
          <SuccessArcIcon
            width={40}
            height={40}
            color={COLORS.primary.GREEN_200}
          />
        }
        iconMargin="0 auto 8px"
        title={t("creatorProfile.passwordSuccessTitle")}
        message={t("creatorProfile.passwordSuccessMessage")}
        confirmLabel={t("nav.login")}
        onClose={() => setShowPasswordSuccessModal(false)}
        onConfirm={() => router.push(PATHS.AUTH_LOGIN)}
        size="sm"
        showCloseButton={false}
      />
    </Container>
  );
}
