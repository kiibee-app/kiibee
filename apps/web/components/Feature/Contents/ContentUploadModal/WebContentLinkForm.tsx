"use client";

import { useTranslation } from "react-i18next";
import InputFields from "@/components/UI/InputFields";
import GenericButton from "@/components/UI/GenericButton";
import { INPUT_VARIANTS, VARIANT } from "@/utils/Constants";
import { isValidUrl } from "@/utils/common";
import {
  WebContentForm,
  WebContentNextButton,
  WebContentTitle,
} from "./styles";

type WebContentLinkFormProps = {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
};

export default function WebContentLinkForm({
  value,
  onChange,
  onNext,
}: WebContentLinkFormProps) {
  const { t } = useTranslation();

  const handleChange = (nextValue: string | string[]) => {
    onChange(Array.isArray(nextValue) ? nextValue.join("") : nextValue);
  };

  const hasInput = value.trim().length > 0;
  const isValid = !hasInput || isValidUrl(value);

  return (
    <WebContentForm>
      <WebContentTitle>
        {t("contents.contentUploadModal.webForm.title")}
      </WebContentTitle>
      <InputFields
        value={value}
        placeholder={t("contents.contentUploadModal.webForm.placeholder")}
        width="100%"
        variant={INPUT_VARIANTS.PRIMARY_GRAY}
        onChange={handleChange}
        label={t("contents.contentUploadModal.webForm.label")}
        hasError={!isValid}
        errorMessage={
          !isValid ? t("contents.general.trailerLinkInvalid") : undefined
        }
      />
      <WebContentNextButton>
        <GenericButton
          variant={VARIANT.PRIMARY}
          minWidth="182px"
          onClick={onNext}
          disabled={!value.trim() || !isValid}
        >
          {t("common.next")}
        </GenericButton>
      </WebContentNextButton>
    </WebContentForm>
  );
}
