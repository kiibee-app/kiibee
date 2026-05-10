"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
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
import { AUTH, CREATOR_PROFILE } from "@/utils/translationKeys";
import InputField from "@/components/UI/InputFields";
import PasswordSection from "./PasswordSection";
import CompanySection from "./CompanySection";
import PaymentSection from "./PaymentSection";
import DeleteSection from "./DeleteSection";
import { INPUT_VARIANTS, VARIANT } from "@/utils/Constants";
import {
  createInitialProfileData,
  creatorProfileData,
  emptyPasswords,
} from "@/utils/dummyData/profile.data";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { getProfileFields } from "@/utils/creatorProfilefields";
import { ProfileForm } from "@/utils/creatorProfile";
import { MODAL_ALIGN } from "@/utils/ui";
import { GenericModal } from "@/components/UI/Modals";
import { SuccessArcIcon } from "@/assets/icons";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import { createResetPasswordSchema } from "@/lib/validation/schema";

export default function CreatorProfile() {
  const { t } = useTranslation();
  const router = useRouter();
  const { name, email } = creatorProfileData;
  const getInitial = (email = "") =>
    email ? email.charAt(0).toUpperCase() : "?";

  const initial = useMemo(() => createInitialProfileData(email), [email]);
  const [form, setForm] = useState<ProfileForm>(initial);
  const [saved, setSaved] = useState<ProfileForm>(initial);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordSuccessModal, setShowPasswordSuccessModal] =
    useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);

  const passwordSchema = useMemo(
    () =>
      createResetPasswordSchema({
        currentRequired: t(CREATOR_PROFILE.currentPassword),
        nextRequired: t(CREATOR_PROFILE.newPassword),
        confirmRequired: t(CREATOR_PROFILE.confirmPassword),
        confirmMismatch: t("viewerSignup.form.passwordMismatch"),
      }),
    [t],
  );
  type PasswordFormValues = ReturnType<typeof passwordSchema.parse>;
  const passwordMethods = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: emptyPasswords,
  });

  const dirty = useMemo(() => {
    const formChanged = JSON.stringify(form) !== JSON.stringify(saved);
    const passwordChanged = passwordMethods.formState.isDirty;
    return formChanged || passwordChanged;
  }, [form, passwordMethods.formState.isDirty, saved]);

  const onChange = useCallback(
    (key: keyof ProfileForm) => (value: string | string[]) => {
      setForm((prev) => ({ ...prev, [key]: String(value) }));
    },
    [],
  );

  const resetPasswords = useCallback(() => {
    passwordMethods.reset(emptyPasswords);
  }, [passwordMethods]);

  const handleCancel = useCallback(() => {
    setForm(saved);
    resetPasswords();
    setShowPassword(false);
  }, [saved, resetPasswords]);

  const handleSave = useCallback(() => {
    if (!dirty) return;
    setSaved(form);
    resetPasswords();
    setShowPassword(false);
  }, [dirty, form, resetPasswords]);

  const handlePasswordClose = useCallback(() => {
    setShowPassword(false);
    resetPasswords();
  }, [resetPasswords]);

  const handlePasswordSave = useCallback(() => {
    resetPasswords();
    setShowPassword(false);
    setShowPasswordSuccessModal(true);
  }, [resetPasswords]);

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
    router.push(AUTH.login);
  };

  return (
    <Container>
      <HeaderRow>
        <Title>
          <MonoText $use="H4_SemiBold">{t(CREATOR_PROFILE.title)}</MonoText>
        </Title>
        <HeaderActions>
          <SecondaryButton onClick={handleCancel}>
            <MonoText $use="Body_Medium">{t("common.cancel")}</MonoText>
          </SecondaryButton>
          <Button onClick={handleSave} disabled={!dirty}>
            <MonoText $use="Body_Medium">{t("common.save")}</MonoText>
          </Button>
        </HeaderActions>
      </HeaderRow>

      <Card>
        <Row>
          <ImageUploader
            image={avatarImage}
            fallback={getInitial(email)}
            alt={t("creatorProfile.profilePhotoAlt")}
            uploadTitle={t("creatorProfile.uploadPhotoTitle")}
            editTitle={t("creatorProfile.editPhotoTitle")}
            onChange={setAvatarImage}
          />

          <NameBlock>
            <MonoText $use="Heading3">{name}</MonoText>
            <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
              {email}
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
        onCancel={handlePasswordClose}
        onConfirm={handlePasswordSave}
        width="630px"
        fullWidthButtons
        buttonRow
        confirmDisabled={!passwordMethods.formState.isValid}
      >
        <FormProvider {...passwordMethods}>
          <PasswordSection />
        </FormProvider>
      </GenericModal>

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
        onConfirm={() => router.push(AUTH.login)}
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
        width="480px"
        padding="40px 30px"
        buttonRow={showDeleteModal}
        fullWidthButtons={showDeleteModal}
        showCloseButton={false}
      />
    </Container>
  );
}
