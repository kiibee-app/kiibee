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

  const [prevVisible, setPrevVisible] = useState(false);
  const [initialName, setInitialName] = useState("");

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setInitialName(collectionName);
    }
  }

  const handleClose = ({
    discard = false,
    keepEditing = false,
  }: {
    discard?: boolean;
    keepEditing?: boolean;
  } = {}) => {
    if (keepEditing) {
      setShowDiscardModal(false);
      return;
    }

    if (discard) {
      setShowDiscardModal(false);
      onClose();
      return;
    }

    const hasChanges = collectionName.trim() !== initialName.trim();
    if (hasChanges) {
      setShowDiscardModal(true);
      return;
    }

    onClose();
  };

  return (
    <>
      <GenericModal
        visible={visible && !showDiscardModal}
        title={t("contents.createCollectionModal.title")}
        cancelLabel={t("common.cancel")}
        confirmLabel={t("common.save")}
        onCancel={handleClose}
        onClose={handleClose}
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
        onClose={() => handleClose({ keepEditing: true })}
        title={t("settings.notifications.discardModal.title")}
        message={t("settings.notifications.discardModal.message")}
        cancelLabel={t("settings.notifications.discardModal.goBack")}
        confirmLabel={t("settings.notifications.discardModal.discard")}
        onCancel={() => handleClose({ keepEditing: true })}
        onConfirm={() => handleClose({ discard: true })}
        size="sm"
        spacing="md"
        fullWidthButtons
        buttonRow
        showCloseButton={false}
      />
    </>
  );
}
