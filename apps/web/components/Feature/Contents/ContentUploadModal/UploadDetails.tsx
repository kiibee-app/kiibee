"use client";

import GenericButton from "@/components/UI/GenericButton";
import InputFields from "@/components/UI/InputFields";
import { INPUT_TYPE } from "@/utils/ui";
import { INPUT_VARIANTS, VARIANT } from "@/utils/Constants";
import { UploadHint } from "@/components/UI/ImageUploadCropModal/styles";
import { AddButtom, UploadHelperText, UploadSuccess } from "./styles";
import { useTranslation } from "react-i18next";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";
import { MonoText } from "@/components/UI/Monotext";

import { SpinnerIcon } from "@/utils/icon/SpinnerIcon";

type Props = {
  title: string;
  description: string;
  setTitle: (v: string | string[]) => void;
  setDescription: (v: string | string[]) => void;
  onAdd: () => void;
  submitLabel: string;
  successMessage: string;
  isSuccess?: boolean;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  uploadType?: string | null;
};

export default function ContentUploadDetails({
  title,
  description,
  setTitle,
  setDescription,
  onAdd,
  submitLabel,
  successMessage,
  isSuccess,
  isSubmitting,
  errorMessage,
  uploadType,
}: Props) {
  const { t } = useTranslation();

  if (isSubmitting) {
    return (
      <UploadSuccess>
        <SpinnerIcon />
        <MonoText $use="H5_Medium">
          {t("contents.contentUploadModal.uploading")}{" "}
          {t(
            `contents.contentTypeModal.options.${uploadType || "video"}`,
          ).toLowerCase()}
        </MonoText>
      </UploadSuccess>
    );
  }

  if (isSuccess) {
    return (
      <UploadSuccess>
        <SuccessModalIcon />
        <MonoText $use="H5_Medium">{successMessage}</MonoText>
      </UploadSuccess>
    );
  }
  return (
    <>
      <UploadHint>
        {t("contents.contentUploadModal.details.addDetails")}
      </UploadHint>

      <InputFields
        type={INPUT_TYPE.TEXT}
        value={title}
        placeholder={t("contents.contentUploadModal.details.titlePlaceholder")}
        width="100%"
        variant={INPUT_VARIANTS.PRIMARY_GRAY}
        onChange={setTitle}
        label={t("contents.contentUploadModal.details.title")}
      />

      <InputFields
        type={INPUT_TYPE.TEXTAREA}
        value={description}
        placeholder={t(
          "contents.contentUploadModal.details.descriptionPlaceholder",
        )}
        width="100%"
        variant={INPUT_VARIANTS.PRIMARY_GRAY}
        onChange={setDescription}
        label={t("contents.contentUploadModal.details.description")}
      />

      <AddButtom>
        <GenericButton
          variant={VARIANT.PRIMARY}
          minWidth="320px"
          onClick={onAdd}
          disabled={!title.trim() || !description.trim() || isSubmitting}
        >
          {submitLabel}
        </GenericButton>
        {errorMessage && <UploadHelperText>{errorMessage}</UploadHelperText>}
      </AddButtom>
    </>
  );
}
