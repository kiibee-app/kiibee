import { GenericModal } from "@/components/UI/Modals";
import { useTranslation } from "react-i18next";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";

type DeleteModalsProps = {
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  showDeleteSuccess: boolean;
  setShowDeleteSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirmDelete: () => void;
  title?: string;
  message?: string;
  onConfirmClose?: () => void;
  onSuccessClose?: () => void;
};

export default function DeleteModals({
  showDeleteConfirm,
  setShowDeleteConfirm,
  showDeleteSuccess,
  setShowDeleteSuccess,
  onConfirmDelete,
  title,
  message,
  onConfirmClose,
  onSuccessClose,
}: DeleteModalsProps) {
  const { t } = useTranslation();

  const handleConfirmClose = () => {
    setShowDeleteConfirm(false);
    onConfirmClose?.();
  };

  const handleSuccessClose = () => {
    setShowDeleteSuccess(false);
    onSuccessClose?.();
  };

  return (
    <>
      <GenericModal
        visible={showDeleteConfirm}
        title={title ?? t("contents.deleteModal.title")}
        message={message ?? t("contents.deleteModal.message")}
        cancelLabel={t("contents.deleteModal.cancel")}
        confirmLabel={t("contents.deleteModal.delete")}
        onCancel={handleConfirmClose}
        onClose={handleConfirmClose}
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
        onClose={handleSuccessClose}
        onConfirm={handleSuccessClose}
        showCloseButton={false}
      />
    </>
  );
}
