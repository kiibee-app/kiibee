"use client";

import GenericButton from "@/components/UI/GenericButton";
import InputFields from "@/components/UI/InputFields";
import { INPUT_TYPE } from "@/utils/ui";
import { INPUT_VARIANTS, VARIANT } from "@/utils/Constants";
import { UploadHint } from "@/components/UI/ImageUploadCropModal/styles";
import { AddButtom, UploadSuccess } from "./styles";
import { useTranslation } from "react-i18next";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";
import { MonoText } from "@/components/UI/Monotext";

type Props = {
  title: string;
  description: string;
  setTitle: (v: string | string[]) => void;
  setDescription: (v: string | string[]) => void;
  onAdd: () => void;
  isSuccess?: boolean;
  uploadType?: string | null;
};

export default function ContentUploadDetails({
  title,
  description,
  setTitle,
  setDescription,
  onAdd,
  isSuccess,
  uploadType,
}: Props) {
  const { t } = useTranslation();
  if (isSuccess) {
    return (
      <UploadSuccess>
        <SuccessModalIcon />
        <MonoText $use="H5_Medium">Uplading {uploadType} </MonoText>
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
          disabled={!title.trim() || !description.trim()}
        >
          {t("contents.contentUploadModal.details.add")}
        </GenericButton>
      </AddButtom>
    </>
  );
}
