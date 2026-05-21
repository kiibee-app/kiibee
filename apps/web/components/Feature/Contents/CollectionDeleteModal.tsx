import { GenericModal } from "@/components/UI/Modals";
import ConfirmationModal from "@/components/UI/ConfirmationModal";
import { useTranslation } from "react-i18next";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";

type DeleteModalsProps = {
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  showDeleteSuccess: boolean;
  setShowDeleteSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirmDelete: () => Promise<void> | void;
};

export default function DeleteModals({
  showDeleteConfirm,
  setShowDeleteConfirm,
  showDeleteSuccess,
  setShowDeleteSuccess,
  onConfirmDelete,
}: DeleteModalsProps) {
  const { t } = useTranslation();
  return (
    <>
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title={t("contents.deleteModal.title")}
        body={t("contents.deleteModal.message")}
        cancelLabel={t("contents.deleteModal.cancel")}
        confirmLabel={t("contents.deleteModal.delete")}
        onConfirm={onConfirmDelete}
        size="sm"
        spacing="xs"
        buttonRow
      />

      <GenericModal
        visible={showDeleteSuccess}
        icon={<SuccessModalIcon />}
        title={t("contents.deleteSuccessModal.title")}
        message={t("contents.deleteSuccessModal.message")}
        confirmLabel={t("contents.deleteSuccessModal.done")}
        onClose={() => setShowDeleteSuccess(false)}
        onConfirm={() => setShowDeleteSuccess(false)}
        showCloseButton={false}
      />
    </>
  );
}
