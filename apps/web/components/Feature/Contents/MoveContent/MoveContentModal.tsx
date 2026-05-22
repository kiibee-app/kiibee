import React, { useState } from "react";
import { GenericModal } from "@/components/UI/Modals";
import { useTranslation } from "react-i18next";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";
import DropdownField from "@/components/UI/InputFields/DropdownField";
import COLORS from "@repo/ui/colors";
import { MonoText } from "@/components/UI/Monotext";
import { CollectionRow } from "@/types/collectionsType";
import { ModalContentWrapper } from "./MoveContentModal.styles";

type MoveContentModalProps = {
  showMoveModal: boolean;
  setShowMoveModal: React.Dispatch<React.SetStateAction<boolean>>;
  showSuccessModal: boolean;
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  collections: CollectionRow[];
  onConfirmMove: (collectionId: string) => void;
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

  const handleConfirmClose = () => {
    setShowMoveModal(false);
    onConfirmClose?.();
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onSuccessClose?.();
  };

  const handleConfirm = () => {
    if (!selectedId && collections.length > 0) {
      onConfirmMove(collections[0].id);
    } else {
      onConfirmMove(selectedId);
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
        title="Move content"
        cancelLabel="Cancel"
        confirmLabel="Save"
        onCancel={handleConfirmClose}
        onClose={handleConfirmClose}
        onConfirm={handleConfirm}
        size="sm"
        spacing="md"
        buttonRow
      >
        <ModalContentWrapper>
          <MonoText $use="Body_SemiBold">Collections</MonoText>
          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
            Select the collection you want to move content to
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
        title="Moved successfully"
        message={`Content moved to ${selectedCollectionName} successfully.`}
        confirmLabel="Done"
        onClose={handleSuccessClose}
        onConfirm={handleSuccessClose}
        showCloseButton={false}
      />
    </>
  );
}
