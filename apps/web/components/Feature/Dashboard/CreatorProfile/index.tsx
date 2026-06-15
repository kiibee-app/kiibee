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
import ConfirmationModal from "@/components/UI/ConfirmationModal";
import { QuestionIcon } from "@/assets/icons/questionIcon";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import { PATHS } from "@/utils/path";
import { useCreatorProfile } from "@/hooks/auth/useCreatorProfile";
import {
  getDisplayFirstLetter,
  useStoredLoginUser,
} from "@/hooks/auth/useStoredLoginUser";
import {
  forgotPwEmail,
  forgotPwError,
  forgotPwIsError,
  forgotPwIsSuccess,
} from "@/utils/viewerProfile";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";

export default function CreatorProfile() {
  const { t } = useTranslation();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const user = useStoredLoginUser();

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
    canSubmitPassword,
    profileFieldErrors,
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
            fallback={getDisplayFirstLetter(displayName, user)}
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
              hasError={!!profileFieldErrors[field.key as keyof ProfileForm]}
              errorMessage={profileFieldErrors[field.key as keyof ProfileForm]}
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
      <CompanySection
        form={form}
        onChange={onChange}
        t={t}
        fieldErrors={profileFieldErrors}
      />
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
        confirmDisabled={isChangingPassword || !canSubmitPassword}
      >
        <PasswordSection
          passwords={passwords}
          onPasswordChange={onPasswordChange}
          fieldErrors={passwordFieldErrors}
        />
      </GenericModal>

      <GenericModal
        visible={forgotPwIsSuccess(forgotPwNotice)}
        icon={<SuccessModalIcon />}
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

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteClose}
        title={t(CREATOR_PROFILE.deleteModal.title)}
        body={t(CREATOR_PROFILE.deleteModal.message)}
        cancelLabel={t(CREATOR_PROFILE.deleteModal.cancel)}
        confirmLabel={t(CREATOR_PROFILE.deleteModal.confirm)}
        onConfirm={handleDeleteRequest}
        confirmVariant={VARIANT.DANGER}
        size="sm"
        spacing="xs"
        buttonRow
        fullWidthButtons
        showCloseButton={false}
      />
      <GenericModal
        visible={showDeleteSuccessModal}
        icon={<SuccessModalIcon />}
        iconMargin="0 auto 8px"
        title={t(CREATOR_PROFILE.deleteSuccessModal.title)}
        message={t(CREATOR_PROFILE.deleteSuccessModal.message)}
        confirmLabel={t(CREATOR_PROFILE.deleteSuccessModal.confirm)}
        onClose={handleDeleteSuccessClose}
        onConfirm={handleDeleteSuccessClose}
        size="sm"
        showCloseButton={false}
      />
      <GenericModal
        visible={showPasswordSuccessModal}
        icon={<SuccessModalIcon />}
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
