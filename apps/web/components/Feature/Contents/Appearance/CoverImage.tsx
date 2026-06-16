"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { AppearancePanel } from "../styles";
import {
  Copy,
  Hint,
  ItemRow,
  Label,
  LogoUploadWrap,
  PreviewImage,
  PreviewWrapper,
  SectionList,
  UploadButton,
} from "./styles";

import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { VARIANT } from "@/utils/Constants";
import { CONTENTS } from "@/utils/translationKeys";
import ImageUploadCropModal from "@/components/UI/ImageUploadCropModal";
import {
  CROP_SHAPE,
  defaultUploadConfigs,
  IMAGE_TYPE,
  ImageType,
} from "@/utils/ui";
import { useIsMobile } from "@/utils/useIsMobile";
import { CoverImageSectionProps, UploadConfig } from "@/types/metadataType";

import { useContentForm } from "../ContentFormContext";
import { FORM_FIELDS } from "@/utils/appearance";
import { useAppearanceForm } from "./AppearanceFormContext";
import { ErrorText } from "../MetaData/styles";

const imageFieldMap = {
  [IMAGE_TYPE.MEDIA_CARD]: "mediaCardThumbnail",
  [IMAGE_TYPE.PORTRAIT]: "portraitThumbnail",
} as const;
const getImageField = (type: ImageType) =>
  imageFieldMap[type as keyof typeof imageFieldMap];

export default function CoverImageSection({
  title,
  subtitle = false,
  uploadConfigs = defaultUploadConfigs,
  useFormContext = false,
}: CoverImageSectionProps) {
  const { t } = useTranslation();
  const { formState, formErrors, updateField, clearFieldError } =
    useContentForm();
  const {
    values: appearanceValues,
    errors: appearanceErrors,
    updateField: updateAppearanceField,
    clearFieldError: clearAppearanceFieldError,
    validateField: validateAppearanceField,
  } = useAppearanceForm();
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const [selectedConfig, setSelectedConfig] =
    React.useState<UploadConfig | null>(null);
  const [images, setImages] = React.useState<Record<ImageType, string | null>>({
    [IMAGE_TYPE.DESKTOP]: null,
    [IMAGE_TYPE.MOBILE]: null,
    [IMAGE_TYPE.MEDIA_CARD]: null,
    [IMAGE_TYPE.PORTRAIT]: null,
  });

  const handleOpenModal = (config: UploadConfig) => {
    setSelectedConfig(config);
    setOpen(true);
  };

  const handleImageApply = (cropped: string) => {
    if (!selectedConfig) return;
    const field = getImageField(selectedConfig.type);
    if (useFormContext) {
      clearFieldError(field);
      updateField(field, cropped);
    } else if (selectedConfig.type === IMAGE_TYPE.DESKTOP) {
      clearAppearanceFieldError(FORM_FIELDS.DESKTOP_COVER_IMAGE_URL);
      updateAppearanceField(FORM_FIELDS.DESKTOP_COVER_IMAGE_URL, cropped);
      validateAppearanceField(FORM_FIELDS.DESKTOP_COVER_IMAGE_URL);
    } else if (selectedConfig.type === IMAGE_TYPE.MOBILE) {
      clearAppearanceFieldError(FORM_FIELDS.MOBILE_COVER_IMAGE_URL);
      updateAppearanceField(FORM_FIELDS.MOBILE_COVER_IMAGE_URL, cropped);
      validateAppearanceField(FORM_FIELDS.MOBILE_COVER_IMAGE_URL);
    } else {
      setImages((prev) => ({
        ...prev,
        [selectedConfig.type]: cropped,
      }));
    }
    setOpen(false);
  };

  const getCurrentImage = () => {
    if (!selectedConfig) return null;
    if (useFormContext) {
      return formState[getImageField(selectedConfig.type)];
    }
    if (selectedConfig.type === IMAGE_TYPE.DESKTOP) {
      return appearanceValues.desktopCoverImageUrl;
    }
    if (selectedConfig.type === IMAGE_TYPE.MOBILE) {
      return appearanceValues.mobileCoverImageUrl;
    }
    return images[selectedConfig.type];
  };

  const imagesToShow = useFormContext
    ? {
        [IMAGE_TYPE.DESKTOP]: null,
        [IMAGE_TYPE.MOBILE]: null,
        [IMAGE_TYPE.MEDIA_CARD]: formState.mediaCardThumbnail,
        [IMAGE_TYPE.PORTRAIT]: formState.portraitThumbnail,
      }
    : {
        [IMAGE_TYPE.DESKTOP]: appearanceValues.desktopCoverImageUrl,
        [IMAGE_TYPE.MOBILE]: appearanceValues.mobileCoverImageUrl,
        [IMAGE_TYPE.MEDIA_CARD]: images[IMAGE_TYPE.MEDIA_CARD],
        [IMAGE_TYPE.PORTRAIT]: images[IMAGE_TYPE.PORTRAIT],
      };

  return (
    <AppearancePanel>
      <SectionList>
        <ItemRow>
          <Copy>
            <Label>{title ?? t(CONTENTS.appearance.coverImage.title)}</Label>
            {!subtitle && (
              <Hint>{t(CONTENTS.appearance.coverImage.subtitle)}</Hint>
            )}
          </Copy>

          {uploadConfigs.map((item) => (
            <Copy key={item.type}>
              <LogoUploadWrap>
                <UploadButton>
                  <GenericButton
                    variant={VARIANT.PRIMARY}
                    minWidth={isMobile ? undefined : "320px"}
                    onClick={() => handleOpenModal(item)}
                  >
                    {item.label ?? (item.labelKey ? t(item.labelKey) : "")}
                  </GenericButton>

                  <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
                    {item.sizeText ?? (item.sizeKey ? t(item.sizeKey) : "")}
                  </MonoText>
                  {useFormContext && formErrors[getImageField(item.type)] ? (
                    <ErrorText role="alert">
                      {formErrors[getImageField(item.type)]}
                    </ErrorText>
                  ) : !useFormContext &&
                    item.type === IMAGE_TYPE.DESKTOP &&
                    appearanceErrors.desktopCoverImageUrl ? (
                    <ErrorText role="alert">
                      {appearanceErrors.desktopCoverImageUrl}
                    </ErrorText>
                  ) : !useFormContext &&
                    item.type === IMAGE_TYPE.MOBILE &&
                    appearanceErrors.mobileCoverImageUrl ? (
                    <ErrorText role="alert">
                      {appearanceErrors.mobileCoverImageUrl}
                    </ErrorText>
                  ) : null}
                </UploadButton>

                <PreviewWrapper>
                  {imagesToShow[item.type] && (
                    <PreviewImage
                      src={imagesToShow[item.type]!}
                      alt={
                        item.label ?? (item.labelKey ? t(item.labelKey) : "")
                      }
                      $type={item.type}
                      $aspectRatio={item.previewAspectRatio}
                      $previewMaxWidth={item.previewMaxWidth}
                      $previewHeight={item.previewHeight}
                      $previewMinHeight={item.previewMinHeight}
                    />
                  )}
                </PreviewWrapper>
              </LogoUploadWrap>
            </Copy>
          ))}
        </ItemRow>
      </SectionList>

      {selectedConfig && (
        <ImageUploadCropModal
          key={selectedConfig.type}
          visible={open}
          titleUpload={t("creatorProfile.uploadPhotoTitle")}
          titleEdit={t("creatorProfile.editPhotoTitle")}
          image={getCurrentImage()}
          onClose={() => setOpen(false)}
          onApply={handleImageApply}
          shape={CROP_SHAPE.RECT}
          cropWidth={selectedConfig.cropWidth}
          cropHeight={selectedConfig.cropHeight}
          recommendedText={true}
        />
      )}
    </AppearancePanel>
  );
}
