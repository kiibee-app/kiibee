"use client";

import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import InputField from "@/components/UI/InputFields";
import { MODAL_ALIGN } from "@/utils/ui";
import { INPUT_VARIANTS } from "@/utils/Constants";
import { CreateCollectionModalContent } from "../styles";

type Props = {
  visible: boolean;
  collectionName: string;
  onChangeCollectionName: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export default function CreateCollectionModal({
  visible,
  collectionName,
  onChangeCollectionName,
  onClose,
  onConfirm,
}: Props) {
  const { t } = useTranslation();

  return (
    <GenericModal
      visible={visible}
      title={t("contents.createCollectionModal.title")}
      cancelLabel={t("common.cancel")}
      confirmLabel={t("common.save")}
      onCancel={onClose}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmDisabled={!collectionName.trim()}
      size="md"
      spacing="start"
      buttonRow
      buttonAlign={MODAL_ALIGN.END}
      textAlign={MODAL_ALIGN.START}
    >
      <CreateCollectionModalContent>
        <InputField
          label={t("contents.createCollectionModal.collectionName")}
          value={collectionName}
          onChange={(value) => onChangeCollectionName(value as string)}
          placeholder={t("contents.createCollectionModal.placeholder")}
          variant={INPUT_VARIANTS.PRIMARY_GRAY}
          height="40px"
        />
      </CreateCollectionModalContent>
    </GenericModal>
  );
}
