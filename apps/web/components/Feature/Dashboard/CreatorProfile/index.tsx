"use client";

import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { DashboardPageWrapper as Container } from "@/components/Layout/Dashboard/styles";
import {
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
import DropdownField from "@/components/UI/InputFields/DropdownField";
import PasswordSection from "./PasswordSection";
import CompanySection from "./CompanySection";
import PaymentSection from "./PaymentSection";
import DeleteSection from "./DeleteSection";
import { INPUT_VARIANTS, VARIANT } from "@/utils/Constants";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { getProfileFields } from "@/utils/creatorProfilefields";
import {
  ProfileForm,
  DELETE_REASON_OPTIONS,
  DELETE_REASON_OTHERS,
} from "@/utils/creatorProfile";
import { MODAL_ALIGN, INPUT_TYPE } from "@/utils/ui";
import { GenericModal } from "@/components/UI/Modals";
import { InfoIcon } from "@/assets/icons";
import { QuestionIcon } from "@/assets/icons/questionIcon";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import { PATHS } from "@/utils/path";
import { useCreatorProfile } from "@/hooks/auth/useCreatorProfile";
import { useDeleteAPI } from "@/lib/http/api";
import { API } from "@/lib/http/api/endpoints";
import { normalizeApiError } from "@/lib/http/errors/apiError";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";
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
import { DeleteUserResponse } from "@/types/auth";

export default function CreatorProfile() {
  const { t } = useTranslation();
  const router = useRouter();
  const { getErrorMessage } = useApiErrorMessage();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showDeletePendingModal, setShowDeletePendingModal] = useState(false);
  const [locallyPendingDeletion, setLocallyPendingDeletion] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const user = useStoredLoginUser();
  const deleteUserMutation = useDeleteAPI<
    DeleteUserResponse,
    { reason: string }
  >(API.auth.deleteUser);

  const isOthersSelected = selectedReason === DELETE_REASON_OTHERS;
  const matchedOption = DELETE_REASON_OPTIONS.find(
    (opt) => opt.value === selectedReason,
  );
  const deleteReason = isOthersSelected
    ? customReason.trim()
    : t(matchedOption?.labelKey ?? "");

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
    hasPendingDeletionRequest: profileHasPendingDeletion,
  } = useCreatorProfile();

  const hasPendingDeletionRequest =
    locallyPendingDeletion || profileHasPendingDeletion;

  const fields = useMemo(() => getProfileFields(t), [t]);

  const handleDeleteClick = () => {
    if (hasPendingDeletionRequest) {
      setShowDeletePendingModal(true);
      return;
    }
    setShowDeleteModal(true);
  };

  const handleDeleteRequest = async () => {
    if (!deleteReason.trim()) return;
    try {
      await deleteUserMutation.mutateAsync({ reason: deleteReason.trim() });
      setShowDeleteModal(false);
      setSelectedReason("");
      setCustomReason("");
      setLocallyPendingDeletion(true);
      setShowDeleteSuccessModal(true);
      toast.success(t(CREATOR_PROFILE.deleteToastMessage));
    } catch (error) {
      const apiError = normalizeApiError(error);
      if (apiError.status === 409) {
        setShowDeleteModal(false);
        setSelectedReason("");
        setCustomReason("");
        setLocallyPendingDeletion(true);
        setShowDeletePendingModal(true);
        return;
      }
      toast.error(getErrorMessage(error, CREATOR_PROFILE.deleteErrorMessage));
    }
  };

  const handleDeleteClose = () => {
    setShowDeleteModal(false);
    setSelectedReason("");
    setCustomReason("");
  };

  const handleDeleteSuccessClose = () => {
    setShowDeleteSuccessModal(false);
  };

  const handleDeletePendingClose = () => {
    setShowDeletePendingModal(false);
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
          {fields.map((field, index) => {
            const fieldKey = field.key as keyof ProfileForm;
            const errorMessage = profileFieldErrors[fieldKey];
            return (
              <InputField
                key={field.key}
                label={field.label}
                value={form[fieldKey]}
                onChange={onChange(fieldKey)}
                variant={INPUT_VARIANTS.PRIMARY_GRAY}
                labelMarginTop={index ? "16px" : undefined}
                hasError={!!errorMessage}
                errorMessage={errorMessage}
                max={field.max}
              />
            );
          })}

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
      <DeleteSection onDelete={handleDeleteClick} />

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

      <GenericModal
        visible={showDeleteModal}
        title={t(CREATOR_PROFILE.deleteModal.title)}
        confirmLabel={t(CREATOR_PROFILE.deleteModal.confirm)}
        cancelLabel={t(CREATOR_PROFILE.deleteModal.cancel)}
        onClose={handleDeleteClose}
        onCancel={handleDeleteClose}
        onConfirm={handleDeleteRequest}
        confirmDisabled={!deleteReason.trim() || deleteUserMutation.isPending}
        confirmLoading={deleteUserMutation.isPending}
        confirmVariant={VARIANT.DANGER}
        size="sm"
        spacing="xs"
        buttonRow
        fullWidthButtons
        showCloseButton={false}
        textAlign={MODAL_ALIGN.START}
      >
        <MonoText $use="Body_Medium" style={{ marginBottom: "12px" }}>
          {t(CREATOR_PROFILE.deleteModal.message)}
        </MonoText>
        <DropdownField
          label={t(CREATOR_PROFILE.deleteModal.reasonLabel)}
          options={DELETE_REASON_OPTIONS.map((option) => ({
            value: option.value,
            label: t(option.labelKey),
          }))}
          value={selectedReason}
          onChange={setSelectedReason}
          placeholder={t(CREATOR_PROFILE.deleteModal.reasonPlaceholder)}
        />
        {isOthersSelected && (
          <div style={{ marginTop: "12px" }}>
            <InputField
              label={t(CREATOR_PROFILE.deleteModal.customReasonLabel)}
              type={INPUT_TYPE.TEXTAREA}
              value={customReason}
              onChange={(value) => setCustomReason(value as string)}
              placeholder={t(
                CREATOR_PROFILE.deleteModal.customReasonPlaceholder,
              )}
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              required
              max={1000}
            />
          </div>
        )}
      </GenericModal>
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
        visible={showDeletePendingModal}
        icon={<InfoIcon size={48} color={COLORS.primary.GREEN_200} />}
        iconMargin="0 auto 12px"
        textAlign={MODAL_ALIGN.CENTER}
        title={t(CREATOR_PROFILE.deletePendingModal.title)}
        message={t(CREATOR_PROFILE.deletePendingModal.message)}
        confirmLabel={t(CREATOR_PROFILE.deletePendingModal.confirm)}
        onClose={handleDeletePendingClose}
        onConfirm={handleDeletePendingClose}
        size="sm"
        spacing="xs"
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
