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
import { QuestionIcon } from "@/assets/icons/questionIcon";
import { useRouter } from "next/navigation";
import { VIEWER_PROFILE_FIELDS } from "@/utils/profile";
import { PATHS } from "@/utils/path";
import {
  getForgotPasswordNoticeEmail,
  getForgotPasswordErrorMessage,
} from "@/utils/viewerProfile";

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
    handleForgotPassword,
    forgotPasswordNotice,
    dismissForgotPasswordNotice,
    passwordFieldErrors,
    isSavingProfile,
    isChangingPassword,
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
        onCancel={() => void handleForgotPassword()}
        onConfirm={() => void handlePasswordSave()}
        size="md"
        fullWidthButtons
        buttonRow
        confirmDisabled={isChangingPassword}
      >
        <PasswordSection
          passwords={passwords}
          onPasswordChange={onPasswordChange}
          fieldErrors={passwordFieldErrors}
        />
      </GenericModal>
      <GenericModal
        visible={showProfileSavedModal}
        icon={
          <SuccessArcIcon
            width={40}
            height={40}
            color={COLORS.primary.GREEN_200}
          />
        }
        iconMargin="0 auto 8px"
        textAlign={MODAL_ALIGN.CENTER}
        title={t("dashboard.viewerProfile.saveModalTitle")}
        message={t("dashboard.viewerProfile.saveModalMessage")}
        confirmLabel={t("dashboard.viewerProfile.saveModalDone")}
        onClose={() => setShowProfileSavedModal(false)}
        onConfirm={() => setShowProfileSavedModal(false)}
        width="480px"
        showCloseButton={false}
      />
      <GenericModal
        visible={forgotPasswordNotice?.variant === "success"}
        icon={
          <SuccessArcIcon
            width={40}
            height={40}
            color={COLORS.primary.GREEN_200}
          />
        }
        iconMargin="0 auto 8px"
        textAlign={MODAL_ALIGN.CENTER}
        title={t("forgotPassword.checkEmailTitle")}
        message={t("dashboard.viewerProfile.forgotPasswordModalMessage", {
          email: getForgotPasswordNoticeEmail(forgotPasswordNotice),
        })}
        confirmLabel={t("dashboard.viewerProfile.saveModalDone")}
        onClose={dismissForgotPasswordNotice}
        onConfirm={dismissForgotPasswordNotice}
        width="480px"
        showCloseButton={false}
      />
      <GenericModal
        visible={forgotPasswordNotice?.variant === "error"}
        icon={
          <QuestionIcon width={40} height={40} color={COLORS.primary.RED} />
        }
        iconMargin="0 auto 8px"
        textAlign={MODAL_ALIGN.CENTER}
        title={t("dashboard.viewerProfile.forgotPasswordErrorTitle")}
        message={getForgotPasswordErrorMessage(forgotPasswordNotice)}
        confirmLabel={t("dashboard.viewerProfile.saveModalDone")}
        onClose={dismissForgotPasswordNotice}
        onConfirm={dismissForgotPasswordNotice}
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
        textAlign={MODAL_ALIGN.CENTER}
        title={t("creatorProfile.passwordSuccessTitle")}
        message={t("creatorProfile.passwordSuccessMessage")}
        confirmLabel={t("nav.login")}
        onClose={() => setShowPasswordSuccessModal(false)}
        onConfirm={() => router.push(PATHS.AUTH_LOGIN)}
        width="480px"
        showCloseButton={false}
      />
    </Container>
  );
}
