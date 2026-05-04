"use client";

import React, { useMemo, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
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
  ModalActions,
  ImagePreviewWrapper,
  ImagePreview,
  CropOverlay,
  ZoomContainer,
  ZoomSlider,
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
import { getCroppedImg } from "@/utils/image";

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

  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDraggingImage, setIsDraggingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewFrameRef = useRef<HTMLDivElement | null>(null);
  const cropAreaRef = useRef<HTMLDivElement | null>(null);

  const dragStateRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

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
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setIsDraggingImage(false);
    dragStateRef.current = null;
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
        setZoom(1);
        setPosition({ x: 0, y: 0 });
      };

      reader.readAsDataURL(file);
    },
    [],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!pendingImage) return;

    dragStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
    };

    setIsDraggingImage(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStateRef.current) return;

    const dx = e.clientX - dragStateRef.current.startX;
    const dy = e.clientY - dragStateRef.current.startY;

    setPosition({
      x: dragStateRef.current.originX + dx,
      y: dragStateRef.current.originY + dy,
    });
  };

  const stopDragging = () => {
    dragStateRef.current = null;
    setIsDraggingImage(false);
  };

  const applyCrop = useCallback(async () => {
    if (!pendingImage) return;

    const frame = previewFrameRef.current;
    if (!frame) return;

    const { width, height } = frame.getBoundingClientRect();

    const croppedImage = await getCroppedImg(
      pendingImage,
      width,
      height,
      {
        x: 0,
        y: 0,
        width,
        height,
      },
      {
        x: position.x / zoom,
        y: position.y / zoom,
      },
      zoom,
    );

    setAvatarImage(croppedImage);
    closePhotoModal();
  }, [pendingImage, position, zoom, closePhotoModal]);

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
              <EditProfileIcon width={36} height={36} />
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
        textAlign={MODAL_ALIGN.START}
        width="630px"
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
                <ImagePreviewWrapper
                  ref={previewFrameRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={stopDragging}
                  onMouseLeave={stopDragging}
                >
                  {pendingImage && (
                    <ImagePreview
                      src={pendingImage}
                      alt={t("creatorProfile.profilePhotoAlt")}
                      $x={position.x}
                      $y={position.y}
                      $zoom={zoom}
                      $isDragging={isDraggingImage}
                    />
                  )}

                  <CropOverlay ref={cropAreaRef} />
                </ImagePreviewWrapper>
              </CropCanvas>

              <ZoomContainer>
                <ZoomSlider
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />
              </ZoomContainer>

              <ModalActions>
                <GenericButton
                  variant={VARIANT.SECONDARY}
                  onClick={closePhotoModal}
                >
                  {t("common.cancel")}
                </GenericButton>
                <GenericButton variant={VARIANT.PRIMARY} onClick={applyCrop}>
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
