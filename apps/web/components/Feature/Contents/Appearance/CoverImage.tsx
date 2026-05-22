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

export default function CoverImageSection({
  title,
  subtitle = false,
  uploadConfigs = defaultUploadConfigs,
}: CoverImageSectionProps) {
  const { t } = useTranslation();
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
    setImages((prev) => ({
      ...prev,
      [selectedConfig.type]: cropped,
    }));
    setOpen(false);
  };

  const getCurrentImage = () => {
    if (!selectedConfig) return null;
    return images[selectedConfig.type];
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
                </UploadButton>

                <PreviewWrapper>
                  {images[item.type] && (
                    <PreviewImage
                      src={images[item.type]!}
                      alt={
                        item.label ?? (item.labelKey ? t(item.labelKey) : "")
                      }
                      $type={item.type}
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
