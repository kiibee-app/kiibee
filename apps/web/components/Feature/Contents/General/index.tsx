"use client";

import React from "react";
import {
  PanelStack,
  GeneralPanel,
  DetailsWrapper,
  DeleteButton,
  DeleteAction,
  InfoColumn,
  FileRow,
  PreviewBox,
  PreviewVideo,
  PlayOverlay,
  ShareCircle,
  WebSection,
  CheckboxRow,
  HelperText,
  TopRow,
  WebAlignWrapper,
  ControlWrap,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import { formatFileSize } from "@/utils/file";
import { FORMAT_TYPE } from "@/utils/types";
import {
  PlayCircleIcon,
  UploadAudioIcon,
  UploadEpubIcon,
  UploadPdfIcon,
  WebLinkIcon,
} from "@/assets/icons";
import COLORS from "@repo/ui/colors";
import { INPUT_VARIANTS } from "@/utils/variants";
import { useTranslation } from "react-i18next";
import TrailerList from "./TrailerList";
import { useContentForm } from "../ContentFormContext";
import { ShareIcon } from "@/assets/icons/shareIcon";
import InputField from "@/components/UI/InputFields";
import { Checkbox } from "@/app/auth/signup-creator/styles";
import { BLANK } from "@/utils/Constants";

type Props = {
  id: string;
  uploadedFile?: File | null;
  uploadedPreview?: string | null;
  onDelete?: (id: string) => void;
};

export default function GeneralContent({
  id,
  uploadedPreview,
  uploadedFile,
  onDelete,
}: Props) {
  const { t } = useTranslation();
  const { formState, updateField } = useContentForm();
  if (!uploadedFile) return null;
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  const uploadType = formState.contentTypeId;
  const previewUrl = uploadedPreview;

  const renderWebSection = () => {
    if (uploadType !== FORMAT_TYPE.WEB) return null;

    return (
      <WebSection>
        <MonoText $use="Body_Medium">
          {t("contents.web.ePublicationLink")}
        </MonoText>
        <ControlWrap>
          <InputField
            value={formState.webLink || ""}
            onChange={(value) => updateField("webLink", value as string)}
            placeholder={t("contents.web.placeholder")}
            width="100%"
            variant={INPUT_VARIANTS.PRIMARY_GRAY}
          />
        </ControlWrap>
        <CheckboxRow>
          <Checkbox
            id="open-new-window"
            type="checkbox"
            checked={Boolean(formState.openInNewWindow)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateField("openInNewWindow", e.target.checked)
            }
          />
          <MonoText $use="Body_Medium">
            {t("contents.web.openInNewWindow")}
          </MonoText>
        </CheckboxRow>

        <HelperText>{t("contents.web.helperLiveStreaming")}</HelperText>

        <CheckboxRow>
          <Checkbox
            id="open-direct-list"
            type="checkbox"
            checked={Boolean(formState.openDirectFromList)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateField("openDirectFromList", e.target.checked)
            }
          />
          <MonoText $use="Body_Medium">
            {t("contents.web.openDirectFromList")}
          </MonoText>
        </CheckboxRow>

        <HelperText>{t("contents.web.helperLiveStreaming")}</HelperText>
      </WebSection>
    );
  };

  const handlePreviewClick = () => {
    if (previewUrl) {
      window.open(previewUrl, BLANK);
    }
  };

  const renderPreview = () => {
    switch (uploadType) {
      case FORMAT_TYPE.VIDEO:
        return (
          <PreviewBox onClick={handlePreviewClick}>
            {previewUrl && <PreviewVideo src={previewUrl} controls={false} />}
            <PlayOverlay>
              <PlayCircleIcon
                width={40}
                height={40}
                color={COLORS.neutral.GRAY_200}
              />
            </PlayOverlay>
          </PreviewBox>
        );

      case FORMAT_TYPE.AUDIO:
        return (
          <PreviewBox onClick={handlePreviewClick}>
            <UploadAudioIcon
              width={64}
              height={64}
              color={COLORS.primary.RED}
            />
          </PreviewBox>
        );

      case FORMAT_TYPE.PDF:
        return (
          <PreviewBox onClick={handlePreviewClick}>
            <UploadPdfIcon width={64} height={64} color={COLORS.primary.RED} />
          </PreviewBox>
        );

      case FORMAT_TYPE.EPUB:
        return (
          <PreviewBox onClick={handlePreviewClick}>
            <UploadEpubIcon
              width={64}
              height={64}
              color={COLORS.primary.BLUE}
            />
          </PreviewBox>
        );
      case FORMAT_TYPE.WEB:
        return (
          <PreviewBox>
            <WebLinkIcon />
            <PlayOverlay>
              <ShareCircle>
                <ShareIcon />
              </ShareCircle>
            </PlayOverlay>
          </PreviewBox>
        );

      default:
        return null;
    }
  };
  const isWeb = uploadType === FORMAT_TYPE.WEB;
  return (
    <PanelStack>
      <GeneralPanel>
        <DetailsWrapper>
          <TopRow>
            <FileRow>
              {renderPreview()}

              <InfoColumn>
                <MonoText $use="Body_Medium">{uploadedFile.name}</MonoText>
                <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
                  {formatFileSize(uploadedFile.size)}
                </MonoText>
              </InfoColumn>
            </FileRow>

            <DeleteAction>
              <DeleteButton onClick={handleDelete}>
                {t("contents.contentUploadModal.deletePermanently")}
              </DeleteButton>
            </DeleteAction>
          </TopRow>

          {isWeb && <WebAlignWrapper>{renderWebSection()}</WebAlignWrapper>}
        </DetailsWrapper>
      </GeneralPanel>
      <TrailerList />
    </PanelStack>
  );
}
