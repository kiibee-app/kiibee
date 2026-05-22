import React, { useState } from "react";
import { GenericModal } from "@/components/UI/Modals";
import { useTranslation } from "react-i18next";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";
import DropdownField from "@/components/UI/InputFields/DropdownField";
import COLORS from "@repo/ui/colors";
import { MonoText } from "@/components/UI/Monotext";
import { CollectionRow } from "@/types/collectionsType";
import { ModalContentWrapper } from "./styles";
import { MODAL_ALIGN } from "@/utils/ui";

type MoveContentModalProps = {
  showMoveModal: boolean;
  setShowMoveModal: React.Dispatch<React.SetStateAction<boolean>>;
  showSuccessModal: boolean;
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  collections: CollectionRow[];
  onConfirmMove: (collectionId: string) => void | Promise<void>;
  onConfirmClose?: () => void;
  onSuccessClose?: () => void;
};

export default function MoveContentModal({
  showMoveModal,
  setShowMoveModal,
  showSuccessModal,
  setShowSuccessModal,
  collections,
  onConfirmMove,
  onConfirmClose,
  onSuccessClose,
}: MoveContentModalProps) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string>("");
  const [isMoving, setIsMoving] = useState(false);

  const handleConfirmClose = () => {
    setShowMoveModal(false);
    onConfirmClose?.();
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onSuccessClose?.();
  };

  const handleConfirm = async () => {
    const collectionId =
      !selectedId && collections.length > 0 ? collections[0].id : selectedId;
    if (!collectionId) return;

    try {
      setIsMoving(true);
      await onConfirmMove(collectionId);
    } catch (error) {
      console.error("Failed to move content", error);
    } finally {
      setIsMoving(false);
    }
  };

  const selectedCollectionName =
    collections.find((c) => c.id === selectedId)?.name ||
    collections[0]?.name ||
    "[Collection_name]";

  return (
    <>
      <GenericModal
        visible={showMoveModal}
        title={t("contents.moveContentModal.title")}
        cancelLabel={t("contents.actions.cancel")}
        confirmLabel={t("contents.actions.save")}
        onCancel={handleConfirmClose}
        onClose={handleConfirmClose}
        onConfirm={handleConfirm}
        size="md"
        spacing="md"
        height="450px"
        buttonRow
        buttonAlign={MODAL_ALIGN.END}
        closeOnConfirm={false}
        confirmDisabled={isMoving}
      >
        <ModalContentWrapper>
          <MonoText $use="Body_SemiBold">
            {t("contents.moveContentModal.collectionLabel")}
          </MonoText>
          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
            {t("contents.moveContentModal.description")}
          </MonoText>
          <DropdownField
            options={collections.map((c) => ({ label: c.name, value: c.id }))}
            value={selectedId || collections[0]?.id}
            onChange={(val) => setSelectedId(val)}
          />
        </ModalContentWrapper>
      </GenericModal>

      <GenericModal
        visible={showSuccessModal}
        icon={<SuccessModalIcon />}
        title={t("contents.moveContentModal.successTitle")}
        message={t("contents.moveContentModal.successMessage", {
          collectionName: selectedCollectionName,
        })}
        confirmLabel={t("contents.deleteSuccessModal.done")}
        onClose={handleSuccessClose}
        onConfirm={handleSuccessClose}
        showCloseButton={false}
      />
    </>
  );
}
