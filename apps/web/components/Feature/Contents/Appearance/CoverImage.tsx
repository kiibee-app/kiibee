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
import { CROP_SHAPE, IMAGE_TYPE, ImageType } from "@/utils/ui";
import { useIsMobile } from "@/utils/useIsMobile";

type UploadConfig = {
  labelKey: string;
  sizeKey: string;
  cropWidth: number;
  cropHeight: number;
  type: ImageType;
};

const uploadConfigs: UploadConfig[] = [
  {
    labelKey: CONTENTS.appearance.coverImage.uploadDesktop,
    sizeKey: CONTENTS.appearance.coverImage.desktopSize,
    cropWidth: 1440,
    cropHeight: 224,
    type: IMAGE_TYPE.DESKTOP,
  },
  {
    labelKey: CONTENTS.appearance.coverImage.uploadMobile,
    sizeKey: CONTENTS.appearance.coverImage.mobileSize,
    cropWidth: 640,
    cropHeight: 600,
    type: IMAGE_TYPE.MOBILE,
  },
];

export default function CoverImageSection() {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const [selectedConfig, setSelectedConfig] =
    React.useState<UploadConfig | null>(null);
  const [images, setImages] = React.useState<Record<ImageType, string | null>>({
    [IMAGE_TYPE.DESKTOP]: null,
    [IMAGE_TYPE.MOBILE]: null,
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
            <Label>{t(CONTENTS.appearance.coverImage.title)}</Label>
            <Hint>{t(CONTENTS.appearance.coverImage.subtitle)}</Hint>
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
                    {t(item.labelKey)}
                  </GenericButton>

                  <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
                    {t(item.sizeKey)}
                  </MonoText>
                </UploadButton>

                <PreviewWrapper>
                  {images[item.type] && (
                    <PreviewImage
                      src={images[item.type]!}
                      alt={t(item.labelKey)}
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
