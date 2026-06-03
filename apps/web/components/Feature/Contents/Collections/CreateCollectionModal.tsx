"use client";

import { useState } from "react";
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
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const handleCancelClick = () => {
    if (collectionName.trim()) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  const handleDiscardConfirm = () => {
    setShowDiscardModal(false);
    onClose();
  };

  const handleDiscardCancel = () => {
    setShowDiscardModal(false);
  };

  return (
    <>
      <GenericModal
        visible={visible && !showDiscardModal}
        title={t("contents.createCollectionModal.title")}
        cancelLabel={t("common.cancel")}
        confirmLabel={t("common.save")}
        onCancel={handleCancelClick}
        onClose={handleCancelClick}
        onConfirm={onConfirm}
        confirmDisabled={!collectionName.trim()}
        closeOnConfirm={false}
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

      <GenericModal
        visible={showDiscardModal}
        onClose={handleDiscardCancel}
        title={t("settings.notifications.discardModal.title")}
        message={t("settings.notifications.discardModal.message")}
        cancelLabel={t("settings.notifications.discardModal.goBack")}
        confirmLabel={t("settings.notifications.discardModal.discard")}
        onCancel={handleDiscardCancel}
        onConfirm={handleDiscardConfirm}
        size="sm"
        spacing="md"
        fullWidthButtons
        buttonRow
        showCloseButton={false}
      />
    </>
  );
}
