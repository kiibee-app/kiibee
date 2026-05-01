"use client";

import React, { useMemo, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import ReactCrop, {
  centerCrop,
  convertToPercentCrop,
  convertToPixelCrop,
  makeAspectCrop,
  type PercentCrop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Container,
  Title,
  Card,
  Row,
  Avatar,
  Fields,
  Action,
  Button,
  SecondaryButton,
  HeaderRow,
  InlineLabel,
  HeaderActions,
  NameBlock,
  AvatarImage,
  AvatarEditButton,
  HiddenInput,
  PhotoModalBody,
  UploadDropZone,
  UploadHint,
  UploadOrText,
  CropCanvas,
  ReactCropWrapper,
  CropTargetImage,
  ModalActions,
} from "./styles";
import { CREATOR_PROFILE } from "@/utils/translationKeys";
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
import { PasswordState, ProfileForm } from "@/utils/creatorProfile";
import { MODAL_ALIGN } from "@/utils/ui";
import { GenericModal } from "@/components/UI/Modals";
import { EditProfileIcon, SuccessArcIcon } from "@/assets/icons";
import { useRouter } from "next/navigation";

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
  const [passwords, setPasswords] = useState<PasswordState>(emptyPasswords);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoStep, setPhotoStep] = useState<"upload" | "edit">("upload");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<PercentCrop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropImageRef = useRef<HTMLImageElement | null>(null);

  const dirty = useMemo(() => {
    const formChanged = JSON.stringify(form) !== JSON.stringify(saved);
    const passwordChanged = Object.values(passwords).some(Boolean);
    return formChanged || passwordChanged;
  }, [form, saved, passwords]);

  const onChange = useCallback(
    (key: keyof ProfileForm) => (value: string | string[]) => {
      setForm((prev) => ({ ...prev, [key]: String(value) }));
    },
    [],
  );

  const onPasswordChange = useCallback(
    (field: keyof PasswordState, value?: string) => {
      setPasswords((prev) => ({ ...prev, [field]: value ?? "" }));
    },
    [],
  );

  const resetPasswords = useCallback(() => {
    setPasswords(emptyPasswords);
  }, []);

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

  const isPasswordFormValid = useMemo(() => {
    return Object.values(passwords).every((val) => val.trim().length > 0);
  }, [passwords]);

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
    router.push("/auth/login");
  };

  const openPhotoModal = useCallback(() => {
    setShowPhotoModal(true);
    if (avatarImage) {
      setPendingImage(avatarImage);
      setPhotoStep("edit");
    } else {
      setPhotoStep("upload");
    }
  }, [avatarImage]);

  const closePhotoModal = useCallback(() => {
    setShowPhotoModal(false);
    setPhotoStep("upload");
    setPendingImage(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
  }, []);

  const handleSelectFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      event.target.value = "";
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result !== "string") return;
        setPendingImage(result);
        setPhotoStep("edit");
        setCrop(undefined);
        setCompletedCrop(undefined);
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  const centerAspectCrop = useCallback(
    (mediaWidth: number, mediaHeight: number, aspect: number): PercentCrop => {
      const baseSize = Math.min(mediaWidth, mediaHeight) * 0.9;
      const pixelCrop = centerCrop(
        makeAspectCrop(
          {
            unit: "px",
            width: baseSize,
          },
          aspect,
          mediaWidth,
          mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
      );
      return convertToPercentCrop(pixelCrop, mediaWidth, mediaHeight);
    },
    [],
  );

  const onCropImageLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = event.currentTarget;
      if (!width || !height) return;
      const nextCrop = centerAspectCrop(width, height, 1);
      setCrop(nextCrop);
      setCompletedCrop(convertToPixelCrop(nextCrop, width, height));
    },
    [centerAspectCrop],
  );

  const onCropChange = useCallback(
    (pixelCrop: PixelCrop, percentCrop: PercentCrop) => {
      // Keep both units in sync so crop never collapses to a line.
      setCrop(percentCrop);
      setCompletedCrop(pixelCrop);
    },
    [],
  );

  const onCropComplete = useCallback((pixelCrop: PixelCrop) => {
    if (pixelCrop.width < 1 || pixelCrop.height < 1) return;
    setCompletedCrop(pixelCrop);
  }, []);

  const applyCrop = useCallback(async () => {
    if (!completedCrop || !cropImageRef.current) return;
    if (completedCrop.width < 1 || completedCrop.height < 1) return;
    const image = cropImageRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const outputSize = 400;

    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      outputSize,
      outputSize,
    );
    setAvatarImage(canvas.toDataURL("image/png"));
    closePhotoModal();
  }, [closePhotoModal, completedCrop]);

  const initialCrop = useMemo<PercentCrop>(
    () => ({
      unit: "%",
      x: 5,
      y: 5,
      width: 90,
      height: 90,
    }),
    [],
  );

  const ensureCrop = crop ?? initialCrop;

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
          <Avatar
            role="button"
            aria-label={t("creatorProfile.editPhoto")}
            onClick={openPhotoModal}
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openPhotoModal();
              }
            }}
          >
            {avatarImage ? (
              <AvatarImage
                src={avatarImage}
                alt={t("creatorProfile.profilePhotoAlt")}
              />
            ) : (
              <MonoText $use="Heading2">{getInitial(email)}</MonoText>
            )}
            <AvatarEditButton
              type="button"
              aria-label={t("creatorProfile.editPhoto")}
              onClick={(event) => {
                event.stopPropagation();
                openPhotoModal();
              }}
            >
              <EditProfileIcon width={16} height={16} />
            </AvatarEditButton>
          </Avatar>
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
        visible={showPhotoModal}
        title={
          photoStep === "upload"
            ? t("creatorProfile.uploadPhotoTitle")
            : t("creatorProfile.editPhotoTitle")
        }
        onClose={closePhotoModal}
        width="520px"
      >
        <PhotoModalBody>
          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleSelectFile}
          />
          {photoStep === "upload" ? (
            <UploadDropZone>
              <UploadHint>{t("creatorProfile.dragPhotoHere")}</UploadHint>
              <UploadOrText>{t("creatorProfile.or")}</UploadOrText>
              <GenericButton
                variant={VARIANT.PRIMARY}
                onClick={() => fileInputRef.current?.click()}
              >
                {t("creatorProfile.choosePhoto")}
              </GenericButton>
            </UploadDropZone>
          ) : (
            <>
              <CropCanvas>
                <ReactCropWrapper>
                  {pendingImage && (
                    <ReactCrop
                      crop={ensureCrop}
                      onChange={onCropChange}
                      onComplete={onCropComplete}
                      minWidth={120}
                      minHeight={120}
                      keepSelection
                      locked
                      aspect={1}
                      circularCrop
                    >
                      <CropTargetImage
                        ref={cropImageRef}
                        src={pendingImage}
                        alt={t("creatorProfile.profilePhotoAlt")}
                        draggable={false}
                        onLoad={onCropImageLoad}
                      />
                    </ReactCrop>
                  )}
                </ReactCropWrapper>
              </CropCanvas>
              <ModalActions>
                <GenericButton
                  variant={VARIANT.SECONDARY}
                  onClick={closePhotoModal}
                >
                  {t("common.cancel")}
                </GenericButton>
                <GenericButton
                  variant={VARIANT.PRIMARY}
                  onClick={applyCrop}
                  disabled={!completedCrop}
                >
                  {t("creatorProfile.apply")}
                </GenericButton>
              </ModalActions>
            </>
          )}
        </PhotoModalBody>
      </GenericModal>
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
        confirmDisabled={!isPasswordFormValid}
      >
        <PasswordSection
          passwords={passwords}
          onPasswordChange={onPasswordChange}
        />
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
        onConfirm={() => router.push("/auth/login")}
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
