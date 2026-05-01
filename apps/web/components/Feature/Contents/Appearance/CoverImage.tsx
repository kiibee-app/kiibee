"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { AppearancePanel } from "../styles";
import {
  Copy,
  Hint,
  ItemRow,
  Label,
  SectionList,
  UploadButton,
} from "./styles";

import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { VARIANT } from "@/utils/Constants";
import { CONTENTS } from "@/utils/translationKeys";

type UploadConfig = {
  labelKey: string;
  sizeKey: string;
};

const uploadConfigs: UploadConfig[] = [
  {
    labelKey: CONTENTS.appearance.coverImage.uploadDesktop,
    sizeKey: CONTENTS.appearance.coverImage.desktopSize,
  },
  {
    labelKey: CONTENTS.appearance.coverImage.uploadMobile,
    sizeKey: CONTENTS.appearance.coverImage.mobileSize,
  },
];

export default function CoverImageSection() {
  const { t } = useTranslation();

  return (
    <AppearancePanel>
      <SectionList>
        <ItemRow>
          <Copy>
            <Label>{t(CONTENTS.appearance.coverImage.title)}</Label>
            <Hint>{t(CONTENTS.appearance.coverImage.subtitle)}</Hint>
          </Copy>

          {uploadConfigs.map((item, index) => (
            <Copy key={index}>
              <UploadButton>
                <GenericButton variant={VARIANT.PRIMARY} minWidth="320px">
                  {t(item.labelKey)}
                </GenericButton>
              </UploadButton>

              <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
                {t(item.sizeKey)}
              </MonoText>
            </Copy>
          ))}
        </ItemRow>
      </SectionList>
    </AppearancePanel>
  );
}
