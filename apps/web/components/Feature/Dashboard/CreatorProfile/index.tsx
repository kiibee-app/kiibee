"use client";

import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Container,
  Title,
  Card,
  Row,
  Fields,
  Action,
  Button,
  SecondaryButton,
  HeaderRow,
  InlineLabel,
  HeaderActions,
  NameBlock,
} from "./styles";
import { CREATOR_PROFILE } from "@/utils/translationKeys";
import InputField from "@/components/UI/InputFields";
import PasswordSection from "./PasswordSection";
import CompanySection from "./CompanySection";
import PaymentSection from "./PaymentSection";
import DeleteSection from "./DeleteSection";
import { INPUT_VARIANTS, VARIANT } from "@/utils/Constants";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { getProfileFields } from "@/utils/creatorProfilefields";
import { ProfileForm } from "@/utils/creatorProfile";
import { MODAL_ALIGN } from "@/utils/ui";
import { GenericModal } from "@/components/UI/Modals";
import { SuccessArcIcon } from "@/assets/icons";
import { QuestionIcon } from "@/assets/icons/questionIcon";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import { PATHS } from "@/utils/path";
import { useCreatorProfile } from "@/hooks/auth/useCreatorProfile";
import {
  forgotPwEmail,
  forgotPwError,
  forgotPwIsError,
  forgotPwIsSuccess,
} from "@/utils/viewerProfile";

export default function CreatorProfile() {
  const { t } = useTranslation();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);

  const getInitial = (email = "") =>
    email ? email.charAt(0).toUpperCase() : "?";

  const {
    form,
    displayName,
    avatarImage,
    setAvatarImage,
    isProfileChanged,
    passwords,
    showPassword,
    setShowPassword,
    showPasswordSuccessModal,
    setShowPasswordSuccessModal,
    onChange,
    onPasswordChange,
    handleCancel,
    handleSave,
    handlePasswordClose,
    handlePasswordSave,
    handleForgotPassword,
    forgotPwNotice,
    dismissForgotPwNotice,
    passwordFieldErrors,
    isSavingProfile,
    isChangingPassword,
  } = useCreatorProfile();

  const fields = useMemo(() => getProfileFields(t), [t]);

  const handleDeleteRequest = () => {
    setShowDeleteModal(false);
    setShowDeleteSuccessModal(true);
  };

  const handleDeleteClose = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteSuccessClose = () => {
    setShowDeleteSuccessModal(false);
    router.push(PATHS.AUTH_LOGIN);
  };

  return (
    <Container>
      <HeaderRow>
        <Title>
          <MonoText $use="H4_SemiBold">{t(CREATOR_PROFILE.title)}</MonoText>
        </Title>
        <HeaderActions>
          <SecondaryButton onClick={handleCancel} disabled={!isProfileChanged}>
            <MonoText $use="Body_Medium">{t("common.cancel")}</MonoText>
          </SecondaryButton>
          <Button
            onClick={() => void handleSave()}
            disabled={!isProfileChanged || isSavingProfile}
          >
            <MonoText $use="Body_Medium">{t("common.save")}</MonoText>
          </Button>
        </HeaderActions>
      </HeaderRow>

      <Card>
        <Row>
          <ImageUploader
            image={avatarImage}
            fallback={getInitial(form.email)}
            alt={t("creatorProfile.profilePhotoAlt")}
            uploadTitle={t("creatorProfile.uploadPhotoTitle")}
            editTitle={t("creatorProfile.editPhotoTitle")}
            onChange={setAvatarImage}
          />

          <NameBlock>
            <MonoText $use="Heading3">{displayName}</MonoText>
            <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
              {form.email}
            </MonoText>
          </NameBlock>
        </Row>

        <Fields>
          {fields.map((field, index) => (
            <InputField
              key={field.key}
              label={field.label}
              value={form[field.key as keyof ProfileForm]}
              onChange={onChange(field.key as keyof ProfileForm)}
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              labelMarginTop={index ? "16px" : undefined}
            />
          ))}

          <Action>
            <InlineLabel>{t(CREATOR_PROFILE.passwordLabel)}</InlineLabel>
            <GenericButton
              variant={VARIANT.PRIMARY}
              onClick={() => setShowPassword(true)}
            >
              {t(CREATOR_PROFILE.changePassword)}
            </GenericButton>
          </Action>
        </Fields>
      </Card>
      <CompanySection form={form} onChange={onChange} t={t} />
      <PaymentSection form={form} onChange={onChange} t={t} />
      <DeleteSection onDelete={() => setShowDeleteModal(true)} />

      <GenericModal
        visible={showPassword}
        title={t(CREATOR_PROFILE.changePassword)}
        textAlign={MODAL_ALIGN.START}
        confirmLabel={t("creatorProfile.changePassword")}
        cancelLabel={t("creatorProfile.forgotPass")}
        onClose={handlePasswordClose}
        onCancel={() => void handleForgotPassword()}
        onConfirm={() => void handlePasswordSave()}
        closeOnConfirm={false}
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
        visible={forgotPwIsSuccess(forgotPwNotice)}
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
          email: forgotPwEmail(forgotPwNotice),
        })}
        confirmLabel={t("dashboard.viewerProfile.saveModalDone")}
        onClose={dismissForgotPwNotice}
        onConfirm={dismissForgotPwNotice}
        width="480px"
        showCloseButton={false}
      />
      <GenericModal
        visible={forgotPwIsError(forgotPwNotice)}
        icon={
          <QuestionIcon width={40} height={40} color={COLORS.primary.RED} />
        }
        iconMargin="0 auto 8px"
        textAlign={MODAL_ALIGN.CENTER}
        title={t("dashboard.viewerProfile.forgotPasswordErrorTitle")}
        message={forgotPwError(forgotPwNotice)}
        confirmLabel={t("dashboard.viewerProfile.saveModalDone")}
        onClose={dismissForgotPwNotice}
        onConfirm={dismissForgotPwNotice}
        width="480px"
        showCloseButton={false}
      />

      <GenericModal
        visible={showDeleteModal || showDeleteSuccessModal}
        icon={
          showDeleteSuccessModal ? (
            <SuccessArcIcon
              width={40}
              height={40}
              color={COLORS.primary.GREEN_200}
            />
          ) : undefined
        }
        iconMargin={showDeleteSuccessModal ? "0 auto 8px" : undefined}
        title={
          showDeleteSuccessModal
            ? t(CREATOR_PROFILE.deleteSuccessModal.title)
            : t(CREATOR_PROFILE.deleteModal.title)
        }
        message={
          showDeleteSuccessModal
            ? t(CREATOR_PROFILE.deleteSuccessModal.message)
            : t(CREATOR_PROFILE.deleteModal.message)
        }
        cancelLabel={
          showDeleteModal ? t(CREATOR_PROFILE.deleteModal.cancel) : undefined
        }
        confirmLabel={
          showDeleteSuccessModal
            ? t(CREATOR_PROFILE.deleteSuccessModal.confirm)
            : t(CREATOR_PROFILE.deleteModal.confirm)
        }
        confirmVariant={showDeleteModal ? VARIANT.DANGER : VARIANT.PRIMARY}
        onCancel={showDeleteModal ? handleDeleteClose : undefined}
        onClose={
          showDeleteSuccessModal ? handleDeleteSuccessClose : handleDeleteClose
        }
        onConfirm={
          showDeleteSuccessModal
            ? handleDeleteSuccessClose
            : handleDeleteRequest
        }
        size="sm"
        spacing="xs"
        buttonRow={showDeleteModal}
        fullWidthButtons={showDeleteModal}
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
